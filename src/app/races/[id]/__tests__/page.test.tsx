import { render, screen } from '@testing-library/react';
import RacePage from '../page';
import { notFound } from 'next/navigation';
import { MarathonData } from '@/types/race';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  })
}));

// Mock marathon routes data
const mockMarathonRoutes: MarathonData[] = [
  {
    id: 'boston-marathon',
    name: 'Boston Marathon',
    description: 'The world\'s oldest annual marathon',
    location: 'Boston, MA',
    distance: 42.195,
    elevationGain: 150,
    difficulty: 'hard',
    coordinates: [
      [42.2181, -71.5238],
      [42.3601, -71.0589]
    ],
    milestones: [
      { distance: 0, description: 'Start - Hopkinton' },
      { distance: 42.195, description: 'Finish - Copley Square' }
    ],
    image: '/images/boston-marathon.jpg',
    startDate: '2024-04-15T00:00:00.000Z',
    endDate: '2024-04-15T23:59:59.999Z',
    courseRecord: '2:03:02',
    recordHolder: 'Geoffrey Mutai',
    recordYear: 2011
  }
];

jest.mock('@/data/marathon-routes', () => ({
  marathonRoutes: mockMarathonRoutes
}));

describe('RacePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders race page with valid id', () => {
    render(<RacePage params={{ id: 'boston-marathon' }} />);
    
    expect(screen.getByText('Boston Marathon')).toBeInTheDocument();
    expect(screen.getByText('The world\'s oldest annual marathon')).toBeInTheDocument();
    expect(screen.getByText('Boston, MA')).toBeInTheDocument();
  });

  it('calls notFound for invalid id', () => {
    render(<RacePage params={{ id: 'invalid-race' }} />);
    expect(notFound).toHaveBeenCalled();
  });

  it('generates correct static params', async () => {
    const { generateStaticParams } = require('../page');
    const params = await generateStaticParams();
    
    expect(params).toEqual([
      { id: 'boston-marathon' }
    ]);
  });

  it('displays marathon record component', () => {
    render(<RacePage params={{ id: 'boston-marathon' }} />);
    
    expect(screen.getByText('Geoffrey Mutai')).toBeInTheDocument();
    expect(screen.getByText('2:03:02')).toBeInTheDocument();
    expect(screen.getByText('2011')).toBeInTheDocument();
  });

  it('transforms marathon route data correctly', () => {
    render(<RacePage params={{ id: 'boston-marathon' }} />);
    
    // Check if dates are displayed
    expect(screen.getByText(/April 15, 2024/)).toBeInTheDocument();
    
    // Check if distance is formatted
    expect(screen.getByText(/42.2 km/)).toBeInTheDocument();
    
    // Check if elevation gain is displayed
    expect(screen.getByText(/150m/)).toBeInTheDocument();
  });
}); 