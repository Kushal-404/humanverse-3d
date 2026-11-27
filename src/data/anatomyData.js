// Educational content is kept separate from the 3D model.
// `modelMesh` must match the mesh name in the scene (placeholder or exported GLB).
// Verify all text against a reliable anatomy reference before publishing.
export const LAYERS = [
  { id: 'skin', label: 'Skin' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'organs', label: 'Internal organs' },
]

const e = (id, name, layer, category, location, description, functions) =>
  ({ id, name, layer, category, location, description, functions, modelMesh: id })

export const anatomyData = Object.fromEntries([
  e('heart', 'Heart', 'organs', 'Circulatory system', 'Thoracic cavity, between the lungs, slightly left of centre',
    'A muscular organ about the size of a fist that pumps blood around the body.',
    ['Pumps oxygen-poor blood to the lungs', 'Pumps oxygen-rich blood to the body']),
  e('left_lung', 'Left lung', 'organs', 'Respiratory system', 'Left side of the thoracic cavity',
    'Has two lobes, leaving room for the heart.', ['Exchanges oxygen and carbon dioxide with the blood']),
  e('right_lung', 'Right lung', 'organs', 'Respiratory system', 'Right side of the thoracic cavity',
    'Has three lobes and is slightly larger than the left lung.', ['Exchanges oxygen and carbon dioxide with the blood']),
  e('brain', 'Brain', 'organs', 'Nervous system', 'Cranial cavity of the skull',
    'The control centre of the nervous system.', ['Processes sensory information', 'Controls movement, thought and memory']),
  e('skull', 'Skull', 'skeleton', 'Skeletal system', 'Head',
    'The bony structure that encloses and protects the brain.', ['Protects the brain', 'Supports the face']),
  e('spine', 'Vertebral column', 'skeleton', 'Skeletal system', 'Back, from skull to pelvis',
    'A column of stacked vertebrae.', ['Supports the trunk', 'Protects the spinal cord']),
  e('ribcage', 'Rib cage', 'skeleton', 'Skeletal system', 'Chest',
    'Twelve pairs of ribs joined to the spine and, mostly, the sternum.', ['Protects the heart and lungs', 'Assists breathing']),
  e('skin', 'Skin', 'skin', 'Integumentary system', 'Whole body surface',
    "The body's largest organ.", ['Barrier against infection', 'Regulates temperature', 'Senses touch']),
].map((a) => [a.id, a]))

// mesh name -> anatomy id (used for raycast selection)
export const meshToId = Object.fromEntries(Object.values(anatomyData).map((a) => [a.modelMesh, a.id]))
