
import { RoadmapSection } from '../roadmap-canvas/types';

const createItem = (title: string, idPrefix: string) => ({
  title,
  id: `${idPrefix}`
});

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

export const CHEMISTRY_ROADMAP: RoadmapSection[] = [
  {
    id: 'chem-basics',
    mainTitle: 'Basic Concepts',
    description: 'Foundations of Chemistry',
    leftBranches: [
      {
        title: 'Mole Concept',
        items: [
          createItem('Atomic & Molecular Masses', 'atomic_molecular_masses'),
          createItem('Mole Concept & Molar Mass', 'mole_concept_molar_mass'),
          createItem('Percentage Composition', 'percentage_composition'),
          createItem('Stoichiometry', 'stoichiometry')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Concentrations',
        items: [
          createItem('Molarity & Molality', 'molarity_molality'),
          createItem('Normality', 'normality'),
          createItem('Mole Fraction', 'mole_fraction'),
          createItem('Limiting Reagent', 'limiting_reagent')
        ]
      }
    ]
  },
  {
    id: 'atomic',
    mainTitle: 'Structure of Atom',
    description: 'Quantum Mechanical Model',
    leftBranches: [
      {
        title: 'Early Models',
        items: [
          createItem('Bohr\'s Model', 'bohrs_model'),
          createItem('Photoelectric Effect', 'photoelectric_effect'),
          createItem('Dual Nature of Matter', 'dual_nature_of_matter'),
          createItem('Heisenberg Uncertainty', 'heisenberg_uncertainty')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Quantum Model',
        items: [
          createItem('Quantum Numbers', 'quantum_numbers'),
          createItem('Shapes of Orbitals', 'shapes_of_orbitals'),
          createItem('Aufbau Principle', 'aufbau_principle'),
          createItem('Pauli Exclusion Principle', 'pauli_exclusion_principle')
        ]
      }
    ]
  },
  {
    id: 'periodicity',
    mainTitle: 'Periodicity',
    leftBranches: [
      {
        title: 'Classification',
        items: [
          createItem('Modern Periodic Law', 'modern_periodic_law'),
          createItem('Nomenclature > 100', 'nomenclature'),
          createItem('s, p, d, f Blocks', 's_p_d_f_blocks'),
          createItem('Periodic Trends', 'periodic_trends')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Trends',
        items: [
          createItem('Atomic Radius', 'atomic_radius'),
          createItem('Ionization Enthalpy', 'ionization_enthalpy'),
          createItem('Electron Gain Enthalpy', 'electron_gain_enthalpy'),
          createItem('Electronegativity', 'electronegativity')
        ]
      }
    ]
  },
  {
    id: 'bonding',
    mainTitle: 'Chemical Bonding',
    description: 'Molecular Structure',
    leftBranches: [
      {
        title: 'Bond Types',
        items: [
          createItem('Ionic Bond', 'ionic_bond'),
          createItem('Covalent Bond', 'covalent_bond'),
          createItem('VSEPR Theory', 'vsepr_theory'),
          createItem('Hybridization', 'hybridization')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Molecular Theory',
        items: [
          createItem('Valence Bond Theory', 'valence_bond_theory'),
          createItem('Molecular Orbital Theory', 'molecular_orbital_theory'),
          createItem('Hydrogen Bonding', 'hydrogen_bonding'),
          createItem('Dipole Moment', 'dipole_moment')
        ]
      }
    ]
  },
  {
    id: 'thermo-chem',
    mainTitle: 'Thermodynamics',
    leftBranches: [
      {
        title: 'Laws',
        items: [
          createItem('First Law', 'first_law'),
          createItem('Enthalpy (H)', 'enthalpy'),
          createItem('Hess\'s Law', 'hess_law'),
          createItem('Entropy & Gibbs Energy', 'entropy_gibbs_energy')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Spontaneity',
        items: [
          createItem('Spontaneous Processes', 'spontaneous_processes'),
          createItem('Gibbs Free Energy Change', 'gibbs_free_energy_change'),
          createItem('Equilibrium Constant', 'equilibrium_constant'),
          createItem('Third Law', 'third_law')
        ]
      }
    ]
  },
  {
    id: 'equilibrium',
    mainTitle: 'Equilibrium',
    leftBranches: [
      {
        title: 'Chemical Eq',
        items: [
          createItem('Law of Mass Action', 'law_of_mass_action'),
          createItem('Kp and Kc Relation', 'kp_and_kc_relation'),
          createItem('Le Chatelier\'s Principle', 'le_chatelier_s_principle'),
          createItem('Factors Affecting Eq', 'factors_affecting_eq')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Ionic Eq',
        items: [
          createItem('Acids and Bases', 'acids_and_bases'),
          createItem('pH Concept', 'pH_concept'),
          createItem('Buffer Solutions', 'buffer_solutions'),
          createItem('Solubility Product', 'solubility_product')
        ]
      }
    ]
  },
  {
    id: 'redox',
    mainTitle: 'Redox Reactions',
    leftBranches: [
      {
        title: 'Concepts',
        items: [
          createItem('Oxidation & Reduction', 'oxidation_reduction'),
          createItem('Oxidation Number', 'oxidation_number'),
          createItem('Balancing Redox Rxns', 'balancing_redox_rxns'),
          createItem('Electrochemical Cells', 'electrochemical_cells')
        ]
      }
    ]
  },
  {
    id: 'organic',
    mainTitle: 'Organic Chemistry',
    description: 'Basic Principles & Techniques',
    leftBranches: [
      {
        title: 'Fundamentals',
        items: [
          createItem('IUPAC Nomenclature', 'iupac_nomenclature'),
          createItem('Isomerism', 'isomerism'),
          createItem('Reaction Intermediates', 'reaction_intermediates'),
          createItem('Electronic Effects (Inductive, Resonance)', 'electronic_effects')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Hydrocarbons',
        items: [
          createItem('Alkanes & Conformations', 'alkanes_and_conformations'),
          createItem('Alkenes & reactions', 'alkenes_and_reactions'),
          createItem('Alkynes', 'alkynes'),
          createItem('Aromatic Hydrocarbons (Benzene)', 'aromatic_hydrocarbons')
        ]
      }
    ]
  }
];

export const BIOLOGY_ROADMAP: RoadmapSection[] = [
  {
    id: 'living-world',
    mainTitle: 'Diversity in Living World',
    leftBranches: [
      {
        title: 'Classification',
        items: [
          createItem('The Living World', 'the_living_world'),
          createItem('Biological Classification', 'biological_classification'),
          createItem('Plant Kingdom', 'plant_kingdom'),
          createItem('Animal Kingdom', 'animal_kingdom')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Taxonony',
        items: [
          createItem('Taxonomic Categories', 'taxonomic_categories'),
          createItem('Kingdom Monera', 'kingdom_monera'),
          createItem('Kingdom Protista', 'kingdom_protista'),
          createItem('Kingdom Fungi', 'kingdom_fungi')
        ]
      }
    ]
  },
  {
    id: 'structure-org',
    mainTitle: 'Structural Organization',
    leftBranches: [
      {
        title: 'Plants',
        items: [
          createItem('Morphology of Flowering Plants', 'morphology_of_flowering_plants'),
          createItem('Anatomy of Flowering Plants', 'anatomy_of_flowering_plants'),
          createItem('Modifications of Roots/Stems', 'modifications_of_roots_stems'),
          createItem('Inflorescence', 'inflorescence')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Animals',
        items: [
          createItem('Animal Tissues', 'animal_tissues'),
          createItem('Cockroach (Morphology/Anatomy)', 'cockroach'),
          createItem('Frog (Brief)', 'frog'),
          createItem('Earthworm (Brief)', 'earthworm')
        ]
      }
    ]
  },
  {
    id: 'cell',
    mainTitle: 'Cell: Structure & Function',
    centerNote: 'Unit of Life',
    leftBranches: [
      {
        title: 'The Cell',
        items: [
          createItem('Prokaryotic vs Eukaryotic', 'prokaryotic_vs_eukaryotic'),
          createItem('Cell Membrane', 'cell_membrane'),
          createItem('Endomembrane System', 'endomembrane_system'),
          createItem('Mitochondria & Plastids', 'mitochondria_and_plastids')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Biomolecules & Division',
        items: [
          createItem('Proteins & Enzymes', 'proteins_and_enzymes'),
          createItem('Nucleic Acids (DNA/RNA)', 'nucleic_acids'),
          createItem('Cell Cycle', 'cell_cycle'),
          createItem('Mitosis & Meiosis', 'mitosis_and_meiosis')
        ]
      }
    ]
  },
  {
    id: 'plant-phys',
    mainTitle: 'Plant Physiology',
    leftBranches: [
      {
        title: 'Transport & Nutrition',
        items: [
          createItem('Water Potential', 'water_potential'),
          createItem('Transpiration', 'transpiration'),
          createItem('Essential Minerals', 'essential_minerals'),
          createItem('Nitrogen Cycle', 'nitrogen_cycle')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Metabolism',
        items: [
          createItem('Photosynthesis (C3/C4)', 'photosynthesis'),
          createItem('Respiration (Glycolysis/Kreb\'s)', 'respiration'),
          createItem('Plant Growth Regulators', 'plant_growth_regulators'),
          createItem('Photoperiodism', 'photoperiodism')
        ]
      }
    ]
  },
  {
    id: 'human-phys-1',
    mainTitle: 'Human Physiology I',
    leftBranches: [
      {
        title: 'Digestion',
        items: [
          createItem('Alimentary Canal', 'alimentary_canal'),
          createItem('Digestive Glands', 'digestive_glands'),
          createItem('Digestion of Food', 'digestion_of_food'),
          createItem('Absorption of Nutrients', 'absorption_of_nutrients')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Respiration',
        items: [
          createItem('Respiratory Organs', 'respiratory_organs'),
          createItem('Mechanism of Breathing', 'mechanism_of_breathing'),
          createItem('Exchange of Gases', 'exchange_of_gases'),
          createItem('Transport of Gases', 'transport_of_gases')
        ]
      }
    ]
  },
  {
    id: 'human-phys-2',
    mainTitle: 'Human Physiology II',
    leftBranches: [
      {
        title: 'Circulation & Excretion',
        items: [
          createItem('Blood Components', 'blood_components'),
          createItem('Cardiac Cycle', 'human_heart'),
          createItem('Urine Formation', 'urine_formation'),
          createItem('Regulation of Kidney Function', 'regulation_of_kidney_function')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Movement & Control',
        items: [
          createItem('Muscle Contraction', 'muscle_contraction'),
          createItem('Skeletal System', 'skeletal_system'),
          createItem('Nerve Impulse', 'nerve_impulse'),
          createItem('Chemical Coordination (Hormones)', 'chemical_coordination')
        ]
      }
    ]
  }
];

export const MATHEMATICS_ROADMAP: RoadmapSection[] = [
  {
    id: 'sets-functions',
    mainTitle: 'Sets & Functions',
    leftBranches: [
      {
        title: 'Foundations',
        items: [
          createItem('Sets & Representations', 'sets_and_representations'),
          createItem('Types of Sets', 'types_of_sets'),
          createItem('Venn Diagrams', 'venn_diagrams'),
          createItem('Operations on Sets', 'operations_on_sets')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Relations',
        items: [
          createItem('Cartesian Product', 'cartesian_product'),
          createItem('Relations & Functions', 'relations_and_functions'),
          createItem('Trigonometric Functions', 'trigonometric_functions'),
          createItem('Trigonometric Equations', 'trigonometric_equations')
        ]
      }
    ]
  },
  {
    id: 'algebra-1',
    mainTitle: 'Algebra I',
    leftBranches: [
      {
        title: 'Numbers & PMI',
        items: [
          createItem('Complex Numbers', 'complex_numbers'),
          createItem('Argand Plane', 'argand_plane'),
          createItem('Linear Inequalities', 'linear_inequalities'),
          createItem('Permutations & Combinations', 'permutations_and_combinations')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Series',
        items: [
          createItem('Binomial Theorem', 'binomial_theorem'),
          createItem('Sequence & Series', 'sequence_and_series'),
          createItem('Arithmetic Progression', 'arithmetic_progression'),
          createItem('Geometric Progression', 'geometric_progression')
        ]
      }
    ]
  },
  {
    id: 'geometry',
    mainTitle: 'Coordinate Geometry',
    leftBranches: [
      {
        title: '2D Geometry',
        items: [
          createItem('Straight Lines', 'straight_lines'),
          createItem('Circle', 'circle'),
          createItem('Parabola', 'parabola'),
          createItem('Ellipse & Hyperbola', 'ellipse_and_hyperbola')
        ]
      }
    ],
    rightBranches: [
      {
        title: '3D Geometry',
        items: [
          createItem('Intro to 3D Geometry', 'intro_to_3d_geometry'),
          createItem('Distance Formula', 'distance_formula'),
          createItem('Section Formula', 'section_formula'),
          createItem('Coordinates in Space', 'coordinates_in_space')
        ]
      }
    ]
  },
  {
    id: 'calculus',
    mainTitle: 'Calculus',
    description: 'Introduction',
    leftBranches: [
      {
        title: 'Limits',
        items: [
          createItem('Limits of Functions', 'limits_of_functions'),
          createItem('Algebra of Limits', 'algebra_of_limits'),
          createItem('Standard Limits', 'standard_limits'),
          createItem('Sandwich Theorem', 'sandwich_theorem')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Derivatives',
        items: [
          createItem('First Principle', 'first_principle'),
          createItem('Algebra of Derivatives', 'algebra_of_derivatives'),
          createItem('Derivative of Polynomials', 'derivative_of_polynomials'),
          createItem('Derivative of Trig Functions', 'derivative_of_trig_functions')
        ]
      }
    ]
  },
  {
    id: 'stats-prob',
    mainTitle: 'Stats & Probability',
    leftBranches: [
      {
        title: 'Statistics',
        items: [
          createItem('Measures of Dispersion', 'measures_of_dispersion'),
          createItem('Mean Deviation', 'mean_deviation'),
          createItem('Standard Deviation', 'standard_deviation'),
          createItem('Variance', 'variance')
        ]
      }
    ],
    rightBranches: [
      {
        title: 'Probability',
        items: [
          createItem('Random Experiments', 'random_experiments'),
          createItem('Event Types', 'event_types'),
          createItem('Axiomatic Probability', 'axiomatic_probability'),
          createItem('Probability of Events', 'probability_of_events')
        ]
      }
    ]
  }
];

export const ROADMAPS = {
  PHYSICS: PHYSICS_ROADMAP,
  CHEMISTRY: CHEMISTRY_ROADMAP,
  BIOLOGY: BIOLOGY_ROADMAP,
  MATHEMATICS: MATHEMATICS_ROADMAP
};
