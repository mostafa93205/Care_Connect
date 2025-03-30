interface MedicalRecord {
  id: string
  patientId: string
  type: string
  category: string
  date: string
  doctor: string
  hospital: string
  description: string
  fileName: string
  fileType: string
  fileSize: number
  fileData: string // Base64 encoded file data
  uploadDate: string
  customFields?: Record<string, string> // For storing template-specific fields
}

export const medicalRecordStorage = {
  uploadRecord: (record: MedicalRecord) => {
    const records = medicalRecordStorage.getRecords()
    records.push(record)
    localStorage.setItem("medicalRecords", JSON.stringify(records))
    return record
  },

  getRecords: (): MedicalRecord[] => {
    const records = localStorage.getItem("medicalRecords")
    return records ? JSON.parse(records) : []
  },

  getRecordsByPatientId: (patientId: string): MedicalRecord[] => {
    return medicalRecordStorage.getRecords().filter((record) => record.patientId === patientId)
  },

  getRecordById: (id: string): MedicalRecord | undefined => {
    return medicalRecordStorage.getRecords().find((record) => record.id === id)
  },

  deleteRecord: (id: string): boolean => {
    const records = medicalRecordStorage.getRecords()
    const index = records.findIndex((record) => record.id === id)
    if (index !== -1) {
      records.splice(index, 1)
      localStorage.setItem("medicalRecords", JSON.stringify(records))
      return true
    }
    return false
  },

  // Get records by type
  getRecordsByType: (patientId: string, type: string): MedicalRecord[] => {
    return medicalRecordStorage.getRecordsByPatientId(patientId).filter((record) => record.type === type)
  },

  // Get records by category
  getRecordsByCategory: (patientId: string, category: string): MedicalRecord[] => {
    return medicalRecordStorage.getRecordsByPatientId(patientId).filter((record) => record.category === category)
  },

  // Get recent records
  getRecentRecords: (patientId: string, limit = 5): MedicalRecord[] => {
    return medicalRecordStorage
      .getRecordsByPatientId(patientId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, limit)
  },
}

// Helper function for the component to use
export const uploadMedicalRecord = (record: MedicalRecord) => {
  return medicalRecordStorage.uploadRecord(record)
}

export const getPatientMedicalRecords = (patientId: string) => {
  return medicalRecordStorage.getRecordsByPatientId(patientId)
}

export const getMedicalRecordById = (id: string) => {
  return medicalRecordStorage.getRecordById(id)
}

export const deleteMedicalRecord = (id: string) => {
  return medicalRecordStorage.deleteRecord(id)
}

export const getRecentMedicalRecords = (patientId: string, limit = 5) => {
  return medicalRecordStorage.getRecentRecords(patientId, limit)
}

export const getMedicalRecordsByType = (patientId: string, type: string) => {
  return medicalRecordStorage.getRecordsByType(patientId, type)
}

export const getMedicalRecordsByCategory = (patientId: string, category: string) => {
  return medicalRecordStorage.getRecordsByCategory(patientId, category)
}

