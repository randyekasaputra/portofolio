// Inisialisasi Three.js
let scene, camera, renderer;
let geometry, material, mesh;
let particles = [];

// Tambah variabel untuk mouse tracking
const mouse = {
    x: 0,
    y: 0
};

function init() {
    // Setup scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Simbol-simbol programming
    const programmingSymbols = [
        '{', '}', '(', ')', ';', 
        '</', '>', '/>', '[]', 
        '+=', '=>', '&&', '||',
        'if', 'for', 'var', 'let',
        'const', 'function', 'class',
        '0', '1', '#', '$', '@'
    ];

    // Membuat text geometry untuk simbol programming
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        for(let i = 0; i < 100; i++) {
            const symbol = programmingSymbols[Math.floor(Math.random() * programmingSymbols.length)];
            const textGeometry = new THREE.TextGeometry(symbol, {
                font: font,
                size: 0.3,
                height: 0.05
            });
            
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(
                    0.5 + Math.random() * 0.5,
                    0.5 + Math.random() * 0.5,
                    1.0
                ),
                transparent: true,
                opacity: 0.6
            });
            
            const textMesh = new THREE.Mesh(textGeometry, material);
            
            // Posisi random
            textMesh.position.x = Math.random() * 40 - 20;
            textMesh.position.y = Math.random() * 40 - 20;
            textMesh.position.z = Math.random() * 40 - 20;
            
            // Rotasi random
            textMesh.rotation.x = Math.random() * Math.PI;
            textMesh.rotation.y = Math.random() * Math.PI;
            
            // Kecepatan rotasi
            textMesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: Math.random() * 0.005
            };
            
            scene.add(textMesh);
            particles.push(textMesh);
        }
    });

    // Menambahkan binary particles
    const binaryGeometry = new THREE.BufferGeometry();
    const binaryCount = 1000;
    const binaryPositions = new Float32Array(binaryCount * 3);
    const binarySizes = new Float32Array(binaryCount);
    
    for(let i = 0; i < binaryCount * 3; i += 3) {
        binaryPositions[i] = Math.random() * 40 - 20;     // x
        binaryPositions[i + 1] = Math.random() * 40 - 20; // y
        binaryPositions[i + 2] = Math.random() * 40 - 20; // z
        
        binarySizes[i/3] = Math.random() * 0.1;
    }
    
    binaryGeometry.setAttribute('position', new THREE.BufferAttribute(binaryPositions, 3));
    binaryGeometry.setAttribute('size', new THREE.BufferAttribute(binarySizes, 1));
    
    const binaryMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const binaryParticles = new THREE.Points(binaryGeometry, binaryMaterial);
    scene.add(binaryParticles);
    particles.push(binaryParticles);

    // Posisi kamera
    camera.position.z = 15;

    // Event listener untuk resize window
    window.addEventListener('resize', onWindowResize, false);
    // Event listener untuk mouse movement
    document.addEventListener('mousemove', onMouseMove, false);

    // Mulai animasi
    animate();
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);

    // Animasi untuk semua particles
    particles.forEach(particle => {
        if(particle instanceof THREE.Mesh) {
            // Animasi untuk text symbols
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            // Floating animation
            particle.position.y += Math.sin(Date.now() * particle.userData.floatSpeed) * 0.001;
        } else {
            // Animasi untuk binary particles
            particle.rotation.y += 0.001;
            const positions = particle.geometry.attributes.position.array;
            for(let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(Date.now() * 0.001 + positions[i-1]) * 0.001;
            }
            particle.geometry.attributes.position.needsUpdate = true;
        }
    });

    // Camera interaction
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mulai aplikasi
init();

// Animasi scroll reveal
const sections = document.querySelectorAll('section');

const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

sections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('hidden');
}); 