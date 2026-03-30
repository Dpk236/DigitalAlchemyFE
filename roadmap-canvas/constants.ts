
import { RoadmapSection } from './types';

const createItem = (title: string, idPrefix: string) => ({
  title,
  id: `${idPrefix}`
});

export const DEFAULT_COMPLETED_PHYSICS = [
  'intro-si_units_prefixes',
  'intro-dimensional_analysis',
  'intro-significant_figures',
  'intro-scientific_notation',
  'intro-absolute_relative_error',
  'intro-percentage_error',
  'intro-propagation_of_errors',
  'intro-least_count_error',
  'intro-distance_vs_displacement',
  'intro-velocity_time_graphs',
  'intro-uniform_acceleration',
  'intro-relative_velocity_1d'
];

export const PHYSICS_ROADMAP: RoadmapSection[] = [
  {
    id: 'intro',
    mainTitle: 'Units & Measurements',
    description: 'The foundation of physical quantities',
    leftBranches: [
      {
        title: 'Fundamental Concepts',
        items: [
          createItem('SI Units & Prefixes', 'si_units_prefixes'),
          createItem('Dimensional Analysis', 'dimensional_analysis'),
          createItem('Significant Figures', 'significant_figures'),
          createItem('Scientific Notation', 'scientific_notation')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Error Analysis',
        items: [
          createItem('Absolute & Relative Error', 'absolute_relative_error'),
          createItem('Percentage Error', 'percentage_error'),
          createItem('Propagation of Errors', 'propagation_of_errors'),
          createItem('Least Count Error', 'least_count_error')
        ]
      }
    ]
  },
  {
    id: 'mechanics-1',
    mainTitle: 'Kinematics',
    description: 'Motion without considering causes',
    leftBranches: [
      {
        title: 'Motion in 1D',
        items: [
          createItem('Distance vs Displacement', 'distance_vs_displacement'),
          createItem('Velocity-Time Graphs', 'velocity_time_graphs'),
          createItem('Uniform Acceleration', 'uniform_acceleration'),
          createItem('Relative Velocity (1D)', 'relative_velocity_1d')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Motion in 2D',
        items: [
          createItem('Projectile Motion', 'projectile_motion'),
          createItem('Uniform Circular Motion', 'uniform_circular_motion'),
          createItem('Vector Addition (Parallelogram)', 'vector_addition'),
          createItem('Relative Velocity (2D)', 'relative_velocity')
        ]
      }
    ]
  },
  {
    id: 'mechanics-2',
    mainTitle: 'Laws of Motion',
    description: 'Force, Inertia, and Dynamics',
    leftBranches: [
      {
        title: 'Newton\'s Foundations',
        items: [
          createItem('Concept of Inertia', 'concept_of_inertia'),
          createItem('Momentum (p = mv)', 'momentum'),
          createItem('Impulse-Momentum Theorem', 'impulse_momentum_theorem'),
          createItem('Conservation of Momentum', 'conservation_of_momentum')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Real-world Dynamics',
        items: [
          createItem('Static & Kinetic Friction', 'static_kinetic_friction'),
          createItem('Banking of Roads', 'banking_of_roads'),
          createItem('Free Body Diagrams', 'free_body_diagrams'),
          createItem('Centripetal Force', 'centripetal_force')
        ]
      }
    ]
  },
  {
    id: 'energy',
    mainTitle: 'Work, Energy & Power',
    leftBranches: [
      {
        title: 'Theorems & Energy',
        items: [
          createItem('Work-Energy Theorem', 'work_energy_theorem'),
          createItem('Kinetic & Potential Energy', 'kinetic_potential_energy'),
          createItem('Conservative Forces', 'conservative_forces'),
          createItem('Non-conservative Forces', 'non_conservative_forces')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Collisions & Power',
        items: [
          createItem('Elastic Collisions', 'elastic_collisions'),
          createItem('Inelastic Collisions', 'inelastic_collisions'),
          createItem('Power (P = dW/dt)', 'power'),
          createItem('Vertical Circular Motion', 'vertical_circular_motion')
        ]
      }
    ]
  },
  {
    id: 'rotational',
    mainTitle: 'System of Particles',
    description: 'Rigid body dynamics',
    leftBranches: [
      {
        title: 'Center of Mass',
        items: [
          createItem('CM for Discrete Bodies', ' cm_for_discrete_bodies'),
          createItem('CM for Continuous Bodies', 'cm_for_continuous_bodies'),
          createItem('Motion of Center of Mass', 'motion_of_center_of_mass'),
          createItem('Moment of Force (Torque)', 'moment_of_force')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Moment of Inertia',
        items: [
          createItem('Radius of Gyration', 'radius_of_gyration'),
          createItem('Parallel Axis Theorem', 'parallel_axis_theorem'),
          createItem('Perpendicular Axis Theorem', 'perpendicular_axis_theorem'),
          createItem('Angular Momentum', 'angular_momentum')
        ]
      }
    ]
  },
  {
    id: 'gravitation',
    mainTitle: 'Gravitation',
    centerNote: 'Orbital Mechanics & Fields',
    leftBranches: [
      {
        title: 'Universal Law',
        items: [
          createItem('Kepler\'s Three Laws', 'keplers_three_laws'),
          createItem('Acceleration due to Gravity', 'acceleration_due_to_gravity'),
          createItem('Variation with Altitude', 'variation_with_altitude'),
          createItem('Variation with Depth', 'variation_with_depth')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Space & Satellites',
        items: [
          createItem('Gravitational Potential', 'gravitational_potential'),
          createItem('Escape Velocity', 'escape_velocity'),
          createItem('Geostationary Satellites', 'geostationary_satellites'),
          createItem('Weightlessness', 'weightlessness')
        ]
      }
    ]
  },
  {
    id: 'matter',
    mainTitle: 'Properties of Matter',
    leftBranches: [
      {
        title: 'Solids & Elasticity',
        items: [
          createItem('Hooke\'s Law', 'hooke_s_law'),
          createItem('Young\'s Modulus', 'youngs_modulus'),
          createItem('Bulk & Shear Modulus', 'bulk_shear_modulus'),
          createItem('Stress-Strain Curve', 'stress_strain_curve')
        ]
      },
      {
        title: 'Fluids - Statics',
        items: [
          createItem('Pascal\'s Law', 'pascals_law'),
          createItem('Archimedes\' Principle', 'archimedes_principle'),
          createItem('Viscosity (Stokes\' Law)', 'viscosity_stokes_law'),
          createItem('Surface Tension', 'surface_tension')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Fluids - Dynamics',
        items: [
          createItem('Bernoulli\'s Theorem', 'bernoullis_theorem'),
          createItem('Equation of Continuity', 'equation_of_continuity'),
          createItem('Torricelli\'s Law', 'torricellis_law'),
          createItem('Venturi-meter', 'venturi_meter')
        ]
      }
    ]
  },
  {
    id: 'thermo',
    mainTitle: 'Thermodynamics',
    leftBranches: [
      {
        title: 'Laws & Heat',
        items: [
          createItem('Zeroth Law (Temp)', 'zeroth_law'),
          createItem('First Law (Energy)', 'first_law'),
          createItem('Specific Heat Capacity', 'specific_heat_capacity'),
          createItem('Isothermal Processes', 'isothermal_processes')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Engines & Entropy',
        items: [
          createItem('Second Law (Entropy)', 'second_law'),
          createItem('Carnot Engine & Efficiency', 'carnot_engine'),
          createItem('Reversible Processes', 'reversible_processes'),
          createItem('Heat Pumps', 'heat_pumps')
        ]
      }
    ]
  },
  {
    id: 'waves',
    mainTitle: 'Oscillations & Waves',
    leftBranches: [
      {
        title: 'Periodic Motion',
        items: [
          createItem('Simple Harmonic Motion', 'simple_harmonic_motion'),
          createItem('SHM of Simple Pendulum', 'shm_of_simple_pendulum'),
          createItem('Damped Oscillations', 'damped_oscillations'),
          createItem('Resonance', 'resonance')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Wave Propagation',
        items: [
          createItem('Waves - Transverse vs Longitudinal', 'waves'),
          createItem('Speed of Wave in String', 'speed_of_wave_in_string'),
          createItem('Newton\'s/Laplace Formula', 'newtons_laplace_formula'),
          createItem('Doppler Effect', 'doppler_effect')
        ]
      }
    ]
  }
];
