
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Stethoscope, AlertCircle, Heart, Pill } from 'lucide-react';
import { Patient } from '@/pages/DoctorPortal';

interface PatientDetailsProps {
  patient: Patient;
  onPatientUpdate: (patient: Patient) => void;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Patient Details</h2>
        <Badge variant="secondary">
          ID: {patient.id}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {patient.name}
            </div>
            <div>
              <span className="font-medium">Age:</span> {patient.age} years
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Last Visit:</span> {patient.lastVisit}
            </div>
          </CardContent>
        </Card>

        {/* Audio Information */}
        {patient.audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Audio Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <audio controls className="w-full">
                <source src={patient.audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        )}

        {/* Symptoms */}
        {patient.symptoms && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{patient.symptoms}</p>
            </CardContent>
          </Card>
        )}

        {/* Possible Causes */}
        {patient.possibleCauses && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Possible Causes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{patient.possibleCauses}</p>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Recommendations */}
        {patient.lifestyleRecommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-500" />
                Lifestyle Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{patient.lifestyleRecommendations}</p>
            </CardContent>
          </Card>
        )}

        {/* Medications */}
        {patient.medications && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-500" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{patient.medications}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
