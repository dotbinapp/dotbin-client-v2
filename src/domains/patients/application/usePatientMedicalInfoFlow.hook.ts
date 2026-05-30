import { toast } from '@shared/ui/feedback'
import { patientMedicalInformationSchema } from '../model'
import type { PatientMedicalInfo } from '../model'
import { usePatientUpdateMutation } from '../queries/patientUpdate.mutation'
import { getPatientSaveErrorMessage } from './usePatientSaveFlow.hook'

interface UsePatientMedicalInfoFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

export function usePatientMedicalInfoFlow({ centerId, getAccessToken }: UsePatientMedicalInfoFlowParams) {
  const patientUpdateMutation = usePatientUpdateMutation({ centerId, getAccessToken })

  const updatePatientMedicalInfo = async (patientId: string, patientMedicalInfo: PatientMedicalInfo[]) => {
    try {
      const medicalInformationDraft = patientMedicalInformationSchema.parse({ patientMedicalInfo })
      await patientUpdateMutation.mutateAsync({
        patientDraft: medicalInformationDraft,
        patientId,
      })
      toast.success('Paciente actualizado', {description: "La informacion médica se ha guardado correctamente"})
      return true
    } catch (error) {
      toast.error('No se pudo guardar la información médica', {
        description: getPatientSaveErrorMessage(error),
      })
      return false
    }
  }

  return {
    isUpdatingMedicalInfo: patientUpdateMutation.isPending,
    updatePatientMedicalInfo,
  }
}
