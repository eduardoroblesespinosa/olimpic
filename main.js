document.addEventListener('DOMContentLoaded', () => {

    const muscleGroups = document.querySelectorAll('.muscle-group');
    const workoutSection = document.getElementById('workout-section');
    const selectedMuscleName = document.getElementById('selected-muscle-name');
    const workoutPlanContainer = document.getElementById('workout-plan');
    const workoutIntro = document.getElementById('workout-intro');
    let currentSelected = null;
    let athleteProfile = {};
    
    // Sound Effect setup
    let audioContext;
    let clickBuffer;
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            fetch('click.mp3')
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data))
                .then(buffer => {
                    clickBuffer = buffer;
                })
                .catch(e => console.error("Error with decoding audio data", e));
        }
    }

    function playClickSound() {
        if (!audioContext || !clickBuffer) return;
        const source = audioContext.createBufferSource();
        source.buffer = clickBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }

    document.body.addEventListener('click', initAudio, { once: true });


    // Enhanced workout data structure
    const workouts = {
        'Pectorales': {
            'Fuerza': [
                { day: 'Día 1: Fuerza y Hipertrofia', focus: 'Pesas Olímpicas, Hipertrofia Muscular', exercises: [
                    { name: 'Press de Banca', sets: 5, reps: '5', type: 'Pesas Olímpicas' },
                    { name: 'Press Inclinado con Mancuernas', sets: 4, reps: '8-10', type: 'Hipertrofia Muscular' },
                    { name: 'Fondos en paralelas (Dips)', sets: 3, reps: 'Al fallo', type: 'Calistenia' }
                ]},
                { day: 'Día 2: Cardio y Recuperación', focus: 'Cardio HIIT, Recuperación', exercises: [
                    { name: 'Sprints en cinta', duration: '20 min (1 min rápido, 1 min lento)', type: 'Cardio HIIT' },
                    { name: 'Estiramientos de pecho y hombros', duration: '15 min', type: 'Recuperación y Descanso' }
                ]},
                { day: 'Día 3: Potencia y Técnica', focus: 'Técnica Específica, Calistenia', exercises: [
                    { name: 'Lanzamiento de balón medicinal (desde el pecho)', sets: 4, reps: '8', type: 'Técnica (Lanzar)' },
                    { name: 'Flexiones pliométricas', sets: 3, reps: '6-8', type: 'Calistenia' },
                ]}
            ],
            // Add plans for other objectives like Velocidad, Resistencia, etc.
        },
        'Abdominales': {
            'Resistencia': [
                 { day: 'Día 1: Resistencia Muscular', focus: 'Isometría, Cardio', exercises: [
                    { name: 'Plancha (Plank)', sets: 4, reps: '90 segundos', type: 'Isometría' },
                    { name: 'Crunches', sets: 3, reps: '25-30', type: 'Resistencia' },
                    { name: 'VO2 Max Ciclismo', duration: '30 min a ritmo constante', type: 'VO2 Max' }
                ]},
                 { day: 'Día 2: Agilidad y Recuperación', focus: 'Técnica, Recuperación', exercises: [
                    { name: 'Giros Rusos', sets: 3, reps: '15 por lado', type: 'Técnica (Correr)' },
                    { name: 'Respiración diafragmática', duration: '10 min', type: 'Recuperación y Descanso' }
                ]}
            ]
        },
        'Bíceps': {
            'Fuerza': [
                { day: 'Día 1: Hipertrofia y Fuerza', focus: 'Hipertrofia Muscular, Calistenia', exercises: [
                    { name: 'Dominadas supinas (Chin-ups)', sets: 4, reps: 'Al fallo', type: 'Calistenia' },
                    { name: 'Curl con barra Z', sets: 4, reps: '8-10', type: 'Hipertrofia Muscular' },
                    { name: 'Curl martillo (Hammer Curls)', sets: 3, reps: '10-12', type: 'Hipertrofia Muscular' }
                ]},
                { day: 'Día 2: Técnica y Aislamiento', focus: 'Técnica Específica, Resistencia', exercises: [
                    { name: 'Curl de concentración', sets: 3, reps: '12 por brazo', type: 'Técnica (Agilidad)' },
                    { name: 'Remo con mancuerna (enfoque en bíceps)', sets: 4, reps: '10 por brazo', type: 'Pesas' },
                ]},
                { day: 'Día 3: Cardio Ligero y Recuperación', focus: 'Recuperación, Cardio', exercises: [
                    { name: 'Remo en máquina (ritmo suave)', duration: '20 min', type: 'Cardio' },
                    { name: 'Estiramiento de bíceps y antebrazos', duration: '10 min', type: 'Recuperación y Descanso' }
                ]}
            ]
        },
        'Deltoides': {
            'Fuerza': [
                 { day: 'Día 1: Fuerza y Volumen', focus: 'Pesas Olímpicas, Hipertrofia', exercises: [
                    { name: 'Press Militar de pie', sets: 5, reps: '5', type: 'Pesas Olímpicas' },
                    { name: 'Elevaciones laterales con mancuernas', sets: 4, reps: '10-12', type: 'Hipertrofia Muscular' },
                    { name: 'Face Pulls', sets: 3, reps: '15', type: 'Técnica (Lanzar)' }
                ]},
                 { day: 'Día 2: Potencia y Estabilidad', focus: 'Técnica Específica, Calistenia', exercises: [
                    { name: 'Push Press', sets: 4, reps: '6', type: 'Pesas Olímpicas' },
                    { name: 'Pino flexiones (asistidas o completas)', sets: 3, reps: 'Al fallo', type: 'Calistenia' },
                ]},
                 { day: 'Día 3: Recuperación Activa', focus: 'Recuperación y Descanso', exercises: [
                    { name: 'Rotaciones de hombro con banda elástica', sets: 3, reps: '20 por lado', type: 'Recuperación' },
                    { name: 'Estiramientos de deltoides', duration: '15 min', type: 'Recuperación y Descanso' }
                ]}
            ]
        },
        'Cuádriceps': {
            'Fuerza': [
                 { day: 'Día 1: Fuerza Máxima', focus: 'Pesas Olímpicas', exercises: [
                    { name: 'Sentadillas (Squats)', sets: 5, reps: '3-5', type: 'Pesas Olímpicas' },
                    { name: 'Prensa de Piernas', sets: 4, reps: '6-8', type: 'Hipertrofia Muscular' },
                ]},
                 { day: 'Día 2: Potencia y Técnica', focus: 'Técnica Específica', exercises: [
                    { name: 'Saltos al cajón (Box Jumps)', sets: 5, reps: '5', type: 'Técnica (Saltar)' },
                    { name: 'Zancadas (Lunges)', sets: 3, reps: '10 por pierna', type: 'Calistenia' }
                ]},
                 { day: 'Día 3: Resistencia y Cardio', focus: 'Resistencia, Cardio', exercises: [
                    { name: 'Extensiones de cuádriceps', sets: 3, reps: '20', type: 'Resistencia' },
                    { name: 'Ciclismo en colinas', duration: '25 min', type: 'Cardio HIIT' }
                ]}
            ]
        }
        // Simplified: Add more muscles and objectives as needed.
    };

    const nutritionPlans = {
        'default': {
            'Carga': {
                meals: [
                    { name: 'Desayuno', items: ['Avena con frutas y nueces', 'Batido de proteínas con plátano'] },
                    { name: 'Almuerzo', items: ['Pechuga de pollo a la plancha (200g)', 'Arroz integral', 'Brócoli al vapor'] },
                    { name: 'Cena', items: ['Salmón al horno', 'Quinoa', 'Ensalada verde con aguacate'] },
                    { name: 'Snacks', items: ['Yogur griego', 'Puñado de almendras'] }
                ],
                vegan: [
                    { name: 'Desayuno', items: ['Avena con bayas y semillas de chía', 'Batido de proteína vegetal con plátano y espinacas'] },
                    { name: 'Almuerzo', items: ['Tofu firme salteado (200g)', 'Arroz integral', 'Brócoli al vapor'] },
                    { name: 'Cena', items: ['Lentejas estofadas con verduras', 'Quinoa', 'Ensalada verde con aguacate y semillas de girasol'] },
                    { name: 'Snacks', items: ['Yogur de soja', 'Puñado de almendras'] }
                ]
            },
            'Corte': {
                meals: [
                    { name: 'Desayuno', items: ['Claras de huevo revueltas', 'Espinacas'] },
                    { name: 'Almuerzo', items: ['Ensalada grande con pechuga de pavo', 'Vinagreta ligera'] },
                    { name: 'Cena', items: ['Pescado blanco al vapor', 'Espárragos'] },
                    { name: 'Snacks', items: ['Requesón bajo en grasa', 'Apio'] }
                ],
                vegan: [
                    { name: 'Desayuno', items: ['Tofu revuelto con cúrcuma', 'Espinacas'] },
                    { name: 'Almuerzo', items: ['Ensalada grande con garbanzos tostados', 'Vinagreta de limón y tahini'] },
                    { name: 'Cena', items: ['Tempeh a la plancha', 'Espárragos y pimientos asados'] },
                    { name: 'Snacks', items: ['Edamame', 'Rodajas de pepino'] }
                ]
            },
            'Competicion': {
                meals: [
                    { name: 'Desayuno', items: ['Porción pequeña de avena', 'Miel'] },
                    { name: 'Almuerzo', items: ['Pasta de trigo integral con salsa de tomate ligera', 'Pequeña porción de pollo'] },
                    { name: 'Cena', items: ['Arroz blanco', 'Pescado blanco de fácil digestión'] },
                    { name: 'Snacks', items: ['Bebida deportiva', 'Gel energético'] }
                ],
                vegan: [
                    { name: 'Desayuno', items: ['Porción pequeña de avena', 'Sirope de arce'] },
                    { name: 'Almuerzo', items: ['Pasta de trigo integral con salsa de tomate ligera y lentejas rojas'] },
                    { name: 'Cena', items: ['Arroz blanco', 'Tofu sedoso en caldo de miso'] },
                    { name: 'Snacks', items: ['Bebida deportiva', 'Dátiles'] }
                ]
            }
        },
        'Detox': {
            meals: [
                { name: 'Mañana', items: ['Agua tibia con limón', 'Batido verde (espinacas, pepino, manzana, jengibre)'] },
                { name: 'Mediodía', items: ['Sopa de verduras depurativa', 'Ensalada de hojas verdes con semillas'] },
                { name: 'Tarde/Noche', items: ['Té de hierbas (diente de león)', 'Caldo de huesos o de verduras'] }
            ]
        }
    };
    
    // Registration form logic
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        athleteProfile = {
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            discipline: document.getElementById('discipline').value,
            objective: document.querySelector('input[name="objective"]:checked').value,
        };
        
        // Hide welcome and show main app
        document.getElementById('welcome-section').classList.add('d-none');
        document.getElementById('main-content').classList.remove('d-none');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
        modal.hide();
        
        // Initialize modules
        setupNutritionModule();
        setupChampionModeModule();
    });

    muscleGroups.forEach(muscle => {
        muscle.addEventListener('click', (e) => {
            playClickSound();
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }
            muscle.classList.add('selected');
            currentSelected = muscle;

            const muscleName = muscle.dataset.name;
            displayWorkout(muscleName, athleteProfile.objective);
        });
    });
    
    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            playClickSound();
            if (e.target.id === 'training-tab') {
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                    currentSelected = null;
                }
                workoutSection.style.display = 'none';
            }
        });
    });

    function displayWorkout(muscleName, objective) {
        selectedMuscleName.textContent = `Plan Semanal para ${muscleName}`;
        workoutIntro.textContent = `Enfoque principal: ${objective}.`;
        
        const planData = workouts[muscleName]?.[objective] || workouts[muscleName]?.[Object.keys(workouts[muscleName])[0]];

        if (!planData) {
            workoutPlanContainer.innerHTML = '<p class="text-center">No hay un plan de entrenamiento específico disponible. Seleccionando plan general.</p>';
            workoutSection.style.display = 'block';
            return;
        }

        let html = '';
        planData.forEach((day, index) => {
            const collapseId = `collapse-${muscleName.replace(/\s+/g, '')}-${index}`;
            html += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                        <strong>${day.day}</strong> <span class="ms-auto text-muted fst-italic me-2">Enfoque: ${day.focus}</span>
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading-${index}">
                    <div class="accordion-body">
                        <ul class="list-group list-group-flush">`;
            day.exercises.forEach(ex => {
                 html += `<li class="list-group-item bg-transparent text-light">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${ex.name}</h5>
                        <small class="badge bg-primary rounded-pill">${ex.type}</small>
                    </div>
                    <p class="mb-1">${ex.sets ? `${ex.sets} series x ${ex.reps} reps` : `Duración: ${ex.duration}`}</p>
                 </li>`;
            });
            html += `</ul></div></div></div>`;
        });
        
        workoutPlanContainer.innerHTML = html;
        // Add event listeners for sound on accordion toggle
        workoutPlanContainer.querySelectorAll('.accordion-button').forEach(button => {
            button.addEventListener('click', playClickSound);
        });

        workoutSection.style.display = 'block';
        workoutSection.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Nutrition Module ---
    function setupNutritionModule() {
        const controls = document.getElementById('nutrition-controls');
        controls.addEventListener('change', () => {
            playClickSound();
            displayNutritionPlan();
        });
        document.getElementById('detox-plan-btn').addEventListener('click', () => {
            playClickSound();
            displayNutritionPlan(true);
        });
        // Initial display
        displayNutritionPlan();
    }

    function displayNutritionPlan(isDetox = false) {
        const display = document.getElementById('nutrition-plan-display');
        const phase = document.querySelector('input[name="nutritionPhase"]:checked').value;
        const isVegan = document.getElementById('vegan-option').checked;

        let plan;
        let title;

        if (isDetox) {
            plan = nutritionPlans.Detox;
            title = 'Plan Desintoxicación';
        } else {
            const basePlan = nutritionPlans.default[phase];
            plan = isVegan ? { meals: basePlan.vegan } : { meals: basePlan.meals };
            title = `Plan de ${phase}` + (isVegan ? ' (Vegano)' : '');
        }

        let html = `<h3 class="text-center mb-3">${title}</h3><div class="row g-3">`;

        plan.meals.forEach(meal => {
            html += `
            <div class="col-md-6 col-lg-3">
                <div class="card h-100 nutrition-card">
                    <div class="card-body">
                        <h5 class="card-title">${meal.name}</h5>
                        <ul class="list-unstyled">
                        ${meal.items.map(item => `<li><i class="bi bi-caret-right-fill me-2"></i>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;
        });

        html += '</div>';
        display.innerHTML = html;
    }

    // --- Champion Mode Module ---
    function setupChampionModeModule() {
        // Audio Player
        const audioPlayer = document.getElementById('mental-audio-player');
        const audioTitle = document.getElementById('audio-title');
        document.querySelectorAll('.audio-player button').forEach(button => {
            button.addEventListener('click', () => {
                playClickSound();
                const src = button.dataset.audioSrc;
                const title = button.dataset.audioTitle;
                if (audioPlayer.src.endsWith(src)) {
                    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
                } else {
                    audioPlayer.src = src;
                    audioTitle.textContent = title;
                    audioPlayer.play();
                }
            });
        });

        // Mental State Form
        const mentalForm = document.getElementById('mental-state-form');
        const focusSlider = document.getElementById('mental-focus-slider');
        const focusValue = document.getElementById('mental-focus-value');

        focusSlider.addEventListener('input', () => {
            focusValue.textContent = focusSlider.value;
        });

        mentalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playClickSound();
            // In a real app, you'd save this data. Here we just give feedback.
            const emotion = document.querySelector('input[name="emotion"]:checked').value;
            alert(`Estado mental registrado:\n- Enfoque: ${focusSlider.value}\n- Emoción: ${emotion}\n\n¡Sigue así, campeón!`);
            mentalForm.reset();
            focusValue.textContent = '5';
        });
    }

});