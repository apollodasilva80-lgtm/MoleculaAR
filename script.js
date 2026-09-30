/* MOLÉCULA 3D */

/* CONFIGURAÇÃO DA MOLÉCULA 3D */

    const container = document.getElementById("molecule-canvas");


    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera(

        45,

        container.clientWidth / container.clientHeight,

        0.1,

        1000

    );


    camera.position.z = 7;



    const renderer = new THREE.WebGLRenderer({

        antialias: true,

        alpha: true

    });


    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );


    renderer.setSize(

        container.clientWidth,

        container.clientHeight

    );


    container.appendChild(renderer.domElement);



    /*ILUMINAÇÃO */


    const ambientLight = new THREE.AmbientLight(

        0xffffff,

        1.5

    );


    scene.add(ambientLight);



    const pointLight = new THREE.PointLight(

        0x4db8ff,

        3,

        100

    );


    pointLight.position.set(

        3,
        3,
        4

    );


    scene.add(pointLight);



    /* GRUPO DA MOLÉCULA*/


    const molecule = new THREE.Group();


    scene.add(molecule);



    /* FUNÇÃO PARA CRIAR ÁTOMOS*/


    function createAtom(

        x,
        y,
        z,
        radius = 0.35,
        color = 0xffffff

    ) {


        const geometry = new THREE.SphereGeometry(

            radius,

            32,

            32

        );


        const material = new THREE.MeshStandardMaterial({

            metalness: 0.2,

            roughness: 0.25,

            emissive: 0x061b35,

            emissiveIntensity: 0.5,
            color: color // ALTERADO: aplica a cor definida para cada átomo.

        });


        const atom = new THREE.Mesh(

            geometry,

            material

        );


        atom.position.set(

            x,
            y,
            z

        );


        molecule.add(atom);


        return atom;

    }



    /* ÁTOMOS */
// ALTERADO: molécula de metano (CH₄) — carbono central + quatro hidrogênios.
const atomCenter = createAtom(0,0,0,0.65,0x303030);
const atom1 = createAtom(-1.15,0.75,0,0.38,0xffffff);
const atom2 = createAtom(1.15,0.75,0,0.38,0xffffff);
const atom3 = createAtom(-0.85,-0.8,0.7,0.38,0xffffff);
const atom4 = createAtom(0.85,-0.8,-0.7,0.38,0xffffff);

/*LIGAÇÕES ENTRE ÁTOMOS */


    function createBond(

        atomA,
        atomB

    ) {


        const start = atomA.position;

        const end = atomB.position;


        const direction = new THREE.Vector3()

            .subVectors(end, start);


        const length = direction.length();


        const geometry = new THREE.CylinderGeometry(

            0.08,

            0.08,

            length,

            16

        );


        const material = new THREE.MeshStandardMaterial({

            metalness: 0.5,

            roughness: 0.3

        });


        const bond = new THREE.Mesh(

            geometry,

            material

        );


        bond.position.copy(

            start.clone().add(

                end

                    .clone()

                    .sub(start)

                    .multiplyScalar(0.5)

            )

        );


        bond.quaternion.setFromUnitVectors(

            new THREE.Vector3(0, 1, 0),

            direction.normalize()

        );


        molecule.add(bond);


    }



    createBond(atomCenter, atom1);

    createBond(atomCenter, atom2);

    createBond(atomCenter, atom3);

    createBond(atomCenter, atom4);

    // ALTERADO: removida a quinta ligação; o metano possui quatro hidrogênios.



    /*ANIMAÇÃO */


    function animate() {

        requestAnimationFrame(animate);


        molecule.rotation.y += 0.004;

        molecule.rotation.x += 0.0015;


        renderer.render(

            scene,

            camera

        );

    }


    animate();



    /* RESPONSIVIDADE */


    window.addEventListener(

        "resize",

        () => {


            if (!container.clientWidth) {

                return;

            }


            camera.aspect =

                container.clientWidth /

                container.clientHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(

                container.clientWidth,

                container.clientHeight

            );

        }

    );

/* NAVEGAÇÃO */

window.addEventListener(

        "scroll",

        function () {


            const navbar =

                document.getElementById("navbar");


            if (window.scrollY > 50) {

                navbar.classList.add("scrolled");

            }

            else {

                navbar.classList.remove("scrolled");

            }

        }

    );



    /*
        Fecha o menu mobile depois que o usuário
        clica em um link.
    */


    document.querySelectorAll(

        ".navbar-nav .nav-link"

    ).forEach(

        function (link) {


            link.addEventListener(

                "click",

                function () {


                    const menu =

                        document.getElementById("menu");


                    if (

                        menu.classList.contains("show")

                    ) {


                        const collapse =

                            bootstrap.Collapse

                                .getInstance(menu);


                        if (collapse) {

                            collapse.hide();

                        }

                    }

                }

            );

        }

    );
