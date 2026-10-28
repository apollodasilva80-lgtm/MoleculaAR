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
const atomCenter = createAtom(0,0,0,0.65,0xC65D00);// atomo central
const atom1 = createAtom(-1.15,0.75,0,0.38,0x00ffff);//atomos secundarios
const atom2 = createAtom(1.15,0.75,0,0.38,0x00ffff);
const atom3 = createAtom(-0.85,-0.8,0.7,0.38,0x00ffff);
const atom4 = createAtom(0.85,-0.8,-0.7,0.38,0x00ffff);

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

/* Código que gera os cards de testers automaticamente a partir do JSON */


async function carregarTesters() {
    const container = document.getElementById("testers-container");

    if (!container) return;

    try {
        const resposta = await fetch("data/testers.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os testers.");
        }

        const testers = await resposta.json();

        testers.forEach((tester) => {
            // Cria o card
            const coluna = document.createElement("div");
            coluna.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "tester-card";

            // Cria a área da foto
            const fotoContainer = document.createElement("div");
            fotoContainer.className = "tester-photo";

            const foto = document.createElement("img");
            foto.src = tester.foto;
            foto.alt = `Foto de ${tester.nome}`;
            foto.loading = "lazy";

            // Cria o nome
            const nome = document.createElement("h3");
            nome.className = "tester-name";
            nome.textContent = tester.nome;

            // Monta a estrutura do card
            fotoContainer.appendChild(foto);
            card.append(fotoContainer, nome);
            coluna.appendChild(card);
            container.appendChild(coluna);
        });

    } catch (erro) {
        console.error("Erro ao carregar os testers:", erro);
        container.textContent = "Não foi possível carregar os testers.";
    }
}

carregarTesters();

//código que gera os cards de membros PELO JSON

async function carregarMembros() {
    const container = document.getElementById("membros-container");

    if (!container) return;

    try {
        const resposta = await fetch("data/membros.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os membros.");
        }

        const membros = await resposta.json();

        membros.forEach((membro) => {
            const coluna = document.createElement("div");
            coluna.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "team-card";

            const fotoContainer = document.createElement("div");
            fotoContainer.className = "member-photo";

            const foto = document.createElement("img");
            foto.src = membro.foto;
            foto.alt = `Foto de ${membro.nome}`;
            foto.loading = "lazy";

            fotoContainer.appendChild(foto);

            const info = document.createElement("div");
            info.className = "member-info";

            const nome = document.createElement("h3");
            nome.textContent = membro.nome;

            const funcao = document.createElement("span");
            funcao.className = "member-role";
            funcao.textContent = membro.funcao;

            const descricao = document.createElement("p");
            descricao.textContent = membro.descricao;

            const redes = document.createElement("div");
            redes.className = "member-social";

            if (membro.github) {
                const github = document.createElement("a");
                github.href = membro.github;
                github.target = "_blank";
                github.rel = "noopener noreferrer";
                github.setAttribute("aria-label", `GitHub de ${membro.nome}`);

                const iconeGithub = document.createElement("i");
                iconeGithub.className = "bi bi-github";

                github.appendChild(iconeGithub);
                redes.appendChild(github);
            }

            if (membro.linkedin) {
                const linkedin = document.createElement("a");
                linkedin.href = membro.linkedin;
                linkedin.target = "_blank";
                linkedin.rel = "noopener noreferrer";
                linkedin.setAttribute("aria-label", `LinkedIn de ${membro.nome}`);

                const iconeLinkedin = document.createElement("i");
                iconeLinkedin.className = "bi bi-linkedin";

                linkedin.appendChild(iconeLinkedin);
                redes.appendChild(linkedin);
            }

            if (membro.lattes) {
                const lattes = document.createElement("a");
                lattes.href = membro.lattes;
                lattes.target = "_blank";
                lattes.rel = "noopener noreferrer";
                lattes.setAttribute("aria-label", `Currículo Lattes de ${membro.nome}`);

                const iconeLattes = document.createElement("i");
                iconeLattes.className = "bi bi-file-earmark-person";

                lattes.appendChild(iconeLattes);
                redes.appendChild(lattes);
            }

            info.append(nome, funcao, descricao, redes);
            card.append(fotoContainer, info);
            coluna.appendChild(card);
            container.appendChild(coluna);
        });



    } catch (erro) {
        console.error("Erro ao carregar os membros:", erro);
        container.textContent = "Não foi possível carregar os membros.";
    }
}

carregarMembros();


