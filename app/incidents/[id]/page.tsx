'use client';

import { IncidentDetail } from '@/app/components/IncidentDetail';
import { useParams } from 'next/navigation';

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;

  return <IncidentDetail incidentId={incidentId} />;
}
