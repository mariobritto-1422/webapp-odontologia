import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const professionalId = session.user.id
    const body = await request.json()

    const {
      appointmentId,
      patientId,
      type,
      message,
      subject,
    }: {
      appointmentId: string
      patientId: string
      type: 'reminder' | 'confirmation' | 'cancellation' | 'status_update'
      message: string
      subject?: string
    } = body

    // Validar datos requeridos
    if (!appointmentId || !patientId || !type || !message) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Obtener datos del paciente
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, name, email, professional_id')
      .eq('id', patientId)
      .eq('professional_id', professionalId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el paciente tenga email
    if (!patient.email) {
      return NextResponse.json(
        { error: 'El paciente no tiene email registrado' },
        { status: 400 }
      )
    }

    // Obtener datos del profesional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('name, email')
      .eq('id', professionalId)
      .single()

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      )
    }

    let notificationId: string | null = null
    let emailSent = false
    let errorMessage: string | null = null

    // Crear registro de notificación (pendiente)
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        appointment_id: appointmentId,
        patient_id: patientId,
        professional_id: professionalId,
        type,
        channel: 'email',
        status: 'pending',
        subject: subject || `Notificación de ${professional.name}`,
        message,
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return NextResponse.json(
        { error: 'Error al crear la notificación' },
        { status: 500 }
      )
    }

    notificationId = notification.id

    try {
      // Intentar enviar el email con Resend
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: `${professional.name} <onboarding@resend.dev>`, // Cambiar por dominio verificado en producción
        to: [patient.email],
        subject: subject || `Notificación de ${professional.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #1E40AF 0%, #10B981 100%);
                color: white;
                padding: 30px 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #ffffff;
                padding: 30px 20px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .footer {
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-radius: 0 0 10px 10px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .message {
                white-space: pre-line;
                padding: 20px;
                background: #f3f4f6;
                border-radius: 8px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">${professional.name}</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${patient.name}</strong>,</p>
              <div class="message">${message}</div>
              <p>Si tenés alguna consulta, no dudes en contactarnos.</p>
              <p style="margin-top: 30px;">Saludos,<br><strong>${professional.name}</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
              <p>Sistema de Gestión de Turnos - Sonrisapp</p>
            </div>
          </body>
          </html>
        `,
      })

      if (emailError) {
        throw emailError
      }

      emailSent = true

      // Actualizar notificación como enviada
      await supabase
        .from('notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
    } catch (error: any) {
      console.error('Error sending email:', error)
      errorMessage = error.message || 'Error desconocido al enviar email'

      // Actualizar notificación como fallida
      if (notificationId) {
        await supabase
          .from('notifications')
          .update({
            status: 'failed',
            error_message: errorMessage,
          })
          .eq('id', notificationId)
      }

      // Si el email falla, devolver error
      return NextResponse.json(
        {
          error: 'Error al enviar el email',
          details: errorMessage,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notificationId,
      emailSent,
    })
  } catch (error: any) {
    console.error('Error in send notification API:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
