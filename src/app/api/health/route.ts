import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Check if Mapbox token is configured
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      return NextResponse.json({
        status: 'warning',
        database: 'connected',
        mapbox: 'not configured',
        message: 'Application is running but Mapbox token is missing'
      });
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      mapbox: 'configured',
      message: 'All systems operational'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      mapbox: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'configured' : 'not configured',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 