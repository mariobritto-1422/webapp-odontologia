import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import { type Odontogram, getStatusLabel, TOOTH_TOOLS } from '@/types/odontogram'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2pt solid #3B82F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    borderBottom: '1pt solid #E5E7EB',
    paddingBottom: 4,
  },
  infoRow: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 3,
  },
  image: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    border: '1pt solid #E5E7EB',
  },
  findingsList: {
    marginTop: 8,
  },
  findingItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
    paddingLeft: 10,
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 6,
    border: '1pt solid #9CA3AF',
  },
  legendLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 10,
  },
})

interface PDFGenerationProps {
  patient: {
    id: string
    name: string
    email: string
    phone?: string
  }
  professional: {
    name: string
    specialty: string
    email: string
    phone?: string
    branding?: {
      consultorioName?: string
    }
  }
  odontogram: Odontogram
  odontogramImageBase64: string
}

// Generar lista de hallazgos a partir del odontograma
function generateFindingsList(odontogram: Odontogram) {
  const findings: string[] = []

  Object.entries(odontogram.teeth).forEach(([toothNumber, tooth]) => {
    // Verificar si el diente completo tiene un estado
    if (tooth.wholeTooth) {
      findings.push(
        `Diente ${toothNumber}: ${getStatusLabel(tooth.wholeTooth.status as any)}${
          tooth.wholeTooth.reason ? ` - ${tooth.wholeTooth.reason}` : ''
        }`
      )
      return
    }

    // Verificar superficies individuales
    const surfaceFindings: string[] = []
    Object.entries(tooth.surfaces).forEach(([surfaceName, surface]) => {
      if (surface && surface.status !== 'healthy') {
        surfaceFindings.push(`${surfaceName}: ${getStatusLabel(surface.status)}`)
      }
    })

    if (surfaceFindings.length > 0) {
      findings.push(`Diente ${toothNumber}: ${surfaceFindings.join(', ')}`)
    }
  })

  return findings
}

export async function generateOdontogramPDF({
  patient,
  professional,
  odontogram,
  odontogramImageBase64,
}: PDFGenerationProps) {
  const findings = generateFindingsList(odontogram)
  const currentDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Odontograma</Text>
          <Text style={styles.subtitle}>
            {professional.branding?.consultorioName || professional.name}
          </Text>
          <Text style={styles.subtitle}>Fecha: {currentDate}</Text>
        </View>

        {/* Información del Profesional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profesional</Text>
          <Text style={styles.infoRow}>Nombre: {professional.name}</Text>
          <Text style={styles.infoRow}>Especialidad: {professional.specialty}</Text>
          <Text style={styles.infoRow}>Email: {professional.email}</Text>
          {professional.phone && (
            <Text style={styles.infoRow}>Teléfono: {professional.phone}</Text>
          )}
        </View>

        {/* Información del Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <Text style={styles.infoRow}>Nombre: {patient.name}</Text>
          <Text style={styles.infoRow}>Email: {patient.email}</Text>
          {patient.phone && (
            <Text style={styles.infoRow}>Teléfono: {patient.phone}</Text>
          )}
        </View>

        {/* Tipo de Dentición */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Dentición</Text>
          <Text style={styles.infoRow}>
            {odontogram.dentitionType === 'permanent' ? 'Permanente' : 'Temporaria'}
          </Text>
        </View>

        {/* Imagen del Odontograma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado Dental</Text>
          <Image src={odontogramImageBase64} style={styles.image} />
        </View>

        {/* Leyenda de colores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leyenda</Text>
          <View style={styles.legendContainer}>
            {TOOTH_TOOLS.map((tool) => (
              <View key={tool.id} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: tool.color }]}
                />
                <Text style={styles.legendLabel}>{tool.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hallazgos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hallazgos Clínicos</Text>
          {findings.length > 0 ? (
            <View style={styles.findingsList}>
              {findings.map((finding, index) => (
                <Text key={index} style={styles.findingItem}>
                  • {finding}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.infoRow}>
              No se registraron hallazgos clínicos
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Documento generado el {currentDate} - Sistema de Gestión Odontológica
        </Text>
      </Page>
    </Document>
  )

  return await renderToBuffer(doc)
}
