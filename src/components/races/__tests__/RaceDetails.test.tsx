import { render, screen } from '@testing-library/react';
import { RaceDetails } from '../RaceDetails';
import { MarathonData } from '@/types/race';

const mockRace: MarathonData = {
  id: 'boston-marathon',
  name: 'Boston Marathon',
  description: 'Historic Boston Marathon route',
  location: 'Boston, MA',
  distance: 42.195,
  elevationGain: 150,
  difficulty: 'moderate',
  coordinates: [
    [42.2181, -71.5238],
    [42.3601, -71.0589]
  ],
  milestones: [],
  image: '/images/boston-marathon.jpg',
  startDate: '2024-04-15T00:00:00.000Z',
  endDate: '2024-04-15T23:59:59.999Z'
};

describe('RaceDetails Component', () => {
  it('renders race information correctly', () => {
    render(<RaceDetails race={mockRace} />);
    
    expect(screen.getByText('Boston Marathon')).toBeInTheDocument();
    expect(screen.getByText('Boston, MA')).toBeInTheDocument();
    expect(screen.getByText(/42.195/)).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('displays record holder information', () => {
    render(<RaceDetails race={mockRace} />);
    
    expect(screen.getByText('Geoffrey Mutai')).toBeInTheDocument();
    expect(screen.getByText('2:03:02')).toBeInTheDocument();
    expect(screen.getByText('2011')).toBeInTheDocument();
  });

  it('shows empty participants list message', () => {
    render(<RaceDetails race={mockRace} />);
    
    expect(screen.getByText(/No participants yet/i)).toBeInTheDocument();
  });

  it('renders with participants', () => {
    const raceWithParticipants = {
      ...mockRace,
      participants: [
        { id: '1', name: 'John Doe', avatar: '/avatar1.jpg' },
        { id: '2', name: 'Jane Smith', avatar: '/avatar2.jpg' }
      ]
    };
    
    render(<RaceDetails race={raceWithParticipants} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
}); 