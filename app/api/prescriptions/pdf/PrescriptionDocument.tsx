import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  // Header profesional
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1E40AF',
  },
  professionalName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  professionalMeta: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
  },
  // Título receta
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  recetaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    color: '#1E40AF',
  },
  dateText: {
    fontSize: 10,
    color: '#555',
  },
  // Secciones
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionValue: {
    fontSize: 11,
  },
  // Medicamentos
  medicationItem: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1E40AF',
  },
  medicationName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginBottom: 3,
  },
  medicationDetail: {
    fontSize: 10,
    color: '#444',
    marginBottom: 1,
  },
  // Firma
  footer: {
    marginTop: 48,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    width: 220,
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#555',
  },
})

type Medication = {
  name: string
  dose: string
  quantity: string
  instructions: string
}

type Props = {
  prescription: {
    id: string
    medications: Medication[]
    diagnosis: string | null
    notes: string | null
    created_at: string
  }
  professional: {
    name: string
    specialty: string
    matricula: string | null
    address: string | null
    work_phone: string | null
  }
  patient: {
    name: string
    dni: string | null
  }
}

function formatDate(isoString: string) {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function PrescriptionDocument({ prescription, professional, patient }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header del profesional */}
        <View style={styles.header}>
          <Text style={styles.professionalName}>{professional.name}</Text>
          <Text style={styles.professionalMeta}>
            {professional.specialty}
            {professional.matricula ? `  |  Mat. ${professional.matricula}` : ''}
          </Text>
          {professional.address && (
            <Text style={styles.professionalMeta}>{professional.address}</Text>
          )}
          {professional.work_phone && (
            <Text style={styles.professionalMeta}>Tel: {professional.work_phone}</Text>
          )}
        </View>

        {/* Título + Fecha */}
        <View style={styles.titleRow}>
          <Text style={styles.recetaTitle}>RECETA MÉDICA</Text>
          <Text style={styles.dateText}>Fecha: {formatDate(prescription.created_at)}</Text>
        </View>

        {/* Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Paciente</Text>
          <Text style={styles.sectionValue}>{patient.name}</Text>
          {patient.dni && (
            <Text style={styles.medicationDetail}>DNI: {patient.dni}</Text>
          )}
        </View>

        {/* Diagnóstico */}
        {prescription.diagnosis && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Diagnóstico</Text>
            <Text style={styles.sectionValue}>{prescription.diagnosis}</Text>
          </View>
        )}

        {/* Medicamentos */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Medicamentos</Text>
          {prescription.medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationName}>
                {index + 1}. {med.name}{med.dose ? ` ${med.dose}` : ''}
              </Text>
              {med.quantity && (
                <Text style={styles.medicationDetail}>Cantidad: {med.quantity}</Text>
              )}
              {med.instructions && (
                <Text style={styles.medicationDetail}>Instrucciones: {med.instructions}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Observaciones */}
        {prescription.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Observaciones</Text>
            <Text style={styles.sectionValue}>{prescription.notes}</Text>
          </View>
        )}

        {/* Firma */}
        <View style={styles.footer}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Firma y sello del profesional</Text>
        </View>

      </Page>
    </Document>
  )
}
