import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { DynamicMap } from '@/components/DynamicMap';
import { MapRoute } from '@/types/route';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const race = await prisma.race.findUnique({
    where: {
      id: params.id,
    },
    include: {
      route: true,
    },
  });

  if (!race) {
    notFound();
  }

  const mapRoute: MapRoute = {
    coordinates: race.route.coordinates,
    progress: 0
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Course Details</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Course Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-semibold">{race.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Elevation Gain</p>
                  <p className="font-semibold">{race.elevationGain}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-semibold capitalize">{race.difficulty}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Course Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{race.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <DynamicMap 
              coordinates={race.route.coordinates}
              progress={0}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 