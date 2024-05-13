const es = {
  Menu: {
    home: "Home",
    network: "Red",
    dashboard: "Panel",
    about: "¿Quiénes somos?",
    contact: "Contacto",
    login: "Login",
  },
  Home: {
    Banner: {
      bannerTitle: "CABGen: Genómica Bacteriana Aplicada a la Clínica",
    },
    CabgenDescription: {
      description:
        "Plataforma digital que integra herramientas para el análisis de datos de secuenciación genómica bacteriana, capaz de organizar, almacenar y proporcionar resultados obtenidos a través de formas eficientes de visualización.",
      articleBtn: "Artículo",
    },
    Statistics: {
      sectionTitle: "CABGen en Números:",
      sectionSubtitle: "Estadística e Impacto",
      sectionDescription:
        "Desde su lanzamiento, CABGen ha atraído un interés creciente, con un número significativo de genomas enviados, abordando una variedad de especies bacterianas. Varios genes de resistencia adquiridos ya han sido identificados. CABGen ha recibido contribuciones de diferentes países, lo que refleja su naturaleza colaborativa y global. Estas estadísticas preliminares resaltan el potencial de CABGen para impulsar avances en la investigación genómica y la salud pública, proporcionando una base sólida para futuros descubrimientos.",
      loginBtn: "Comenzar",
    },
    BoxInfo: {
      genomesInfo: "genomas enviados",
      speciesInfo: "especies analizadas",
      genesInfo: "genes de resistencia detectados",
      countriesInfo: "países remitentes",
    },
    GenomicSurveillance: {
      sectionTitle: "RED NACIONAL DE VIGILANCIA GENÓMICA DE",
      sectionSubtitle: "BACTERIAS MULTIRRESISTENTES EN BRASIL",
      sectionDescription:
        "Red que integra laboratorios brasileños para la secuenciación genómica de bacterias productoras de carbapenemasas para obtener información relevante para el control de la propagación de estos microorganismos.",
      learMoreBtn: "Saber más",
    },
    AntimicrobialResistance: {
      sectionTitle: "¿ Qué es",
      sectionSubtitle: "Resistencia Antimicrobiana ?",
      sectionDescription:
        "La resistencia antimicrobiana (RAM) representa una amenaza global para la eficacia de los tratamientos para infecciones causadas por microorganismos como virus, bacterias, hongos y parásitos. Esta resistencia surge cuando estos microorganismos sufren mutaciones o adquieren nuevos genes que los hacen resistentes al tratamiento. Los patógenos bacterianos prevalentes en hospitales tienen tasas alarmantes de resistencia, prolongando las infecciones, aumentando el riesgo de propagación y los costos hospitalarios. Este escenario requiere acción conjunta de todos los sectores de la sociedad y del gobierno. La RAM no reconoce fronteras y afecta no solo la salud humana, sino también la salud animal, la productividad agrícola y la seguridad alimentaria.",
      omsBtn: "OMS",
      nationalPlanBtn: "Plan Nacional",
    },
    Financiers: {
      sectionTitle: "Financiadores",
    },
  },
  Network: {
    Description: {
      firstParagraph:
        "La red reúne expertos en resistencia antimicrobiana (RAM) y bioinformática de diferentes unidades de Fiocruz, LACEN y CGLAB-MS, con un enfoque principal en la estructuración, capacitación, análisis e interpretación de datos de secuenciación de genoma completo de bacterias multirresistentes. Esta iniciativa permitirá una comprensión más profunda del escenario de la RAM en Brasil, con la intención de garantizar agilidad para futuras acciones en el control de la propagación de estos microorganismos.",
      secondParagraph:
        "Cada laboratorio participante en la red realiza el secuenciamiento de forma independiente, y el análisis de los datos generados está estandarizado y automatizado a través de CABGen. La información generada por los miembros de la red está disponible de forma visual e interactiva en CABGen, lo que permite la comunicación de los resultados a la comunidad científica y a los profesionales de la salud.",
      thirdParagraphFirstPart:
        "El enfoque inicial de la red es el estudio de especies de bacilos gramnegativos multirresistentes",
      thirdParagraphSecondPart:
        "Pseudomonas aeruginosa, Acinetobacter baumannii y Klebsiella pneumoniae",
      thirdParagraphThirdPart:
        ", productores de carbapenemasas. Estas muestras se incluyen en la Colección de Cultivos Bacterianos de Origen Hospitalario (CCBH/IOC - WDCM 947), para la preservación de cultivos bacterianos. Además, los datos genómicos están protegidos en un servidor propio alojado en Fiocruz/RJ, en una sala de seguridad certificada según la NBR 15247. La red está abierta para formalización de nuevos socios. Si está interesado, por favor contáctenos.",
      contactBtn: "Contacto",
      dashboardBtn: "Panel",
    },
    Map: {
      sectionTitle: "Miembros Actuales",
    },
  },
  Dashboard: {
    sectionTitle: "Datos de la Red Genómica",
  },
  About: {
    CabgenMission: {
      sectionTitle: "Comprende ",
      sectionSubtitle: "Misión y Propósito",
      sectionDescriptionFirstParagraph:
        "CABGen surge como una solución a los desafíos enfrentados con el aumento exponencial de datos generados por la secuenciación genómica de bacterias resistentes a los antimicrobianos (RAM). En respuesta a la urgencia de combatir la RAM y cerrar la brecha entre la generación y el análisis de datos genómicos, CABGen ofrece funcionalidades esenciales como identificación de especies, detección de genes y mutaciones relacionadas con la resistencia, asignación de un perfil clonal y verificación de la existencia de plásmidos. Estas herramientas simplifican y mejoran el análisis e interpretación de datos biológicos, proporcionando conocimientos valiosos para aplicaciones clínicas.",
      sectionDescriptionSecondParagraph:
        "Además, el sistema está en constante evolución para satisfacer las crecientes demandas, con planes para la instalación de un nuevo servidor que permitirá hasta 60 análisis en paralelo, así como un almacenamiento robusto capaz de soportar hasta 120,000 muestras. La seguridad de CABGen está garantizada tanto por el firewall de la red del Programa de Computación Científica (PROCC) como por las rigurosas políticas de seguridad de Fiocruz.",
      articleBtn: "Artículo",
    },
    CabgenPipeline: {
      sectionTitle: "Dentro del ",
    },
    CabgenResults: {
      sectionTitle: "Resultados de ",
    },
    Team: {
      sectionTitle: "Conozca a nuestros profesionales",
      roleAnaPaula:
        "Responsable de coordinar el proyecto, analizar los resultados fenotípicos, moleculares y de secuenciación y enviar los resultados al Sistema de Gestión del Entorno de Laboratorio (GAL).",
      roleFabricio:
        "Responsable de gestionar el uso del servidor de Fiocruz para el ensamblaje de genomas y el desarrollo de la base de datos para la disponibilidad de genomas.",
      roleFelicita:
        "Estudiante de doctorado en el Programa de Biología Computacional y Sistemas del Doctorado en Ciencias de la Salud Cooperación internacional entre la Fundação Oswaldo Cruz y el Focem-Mercosur - Paraguay.",
      roleMelise:
        "Responsable de analizar los resultados obtenidos en el secuenciación de genomas completos.",
      roleRodolpho: "Investigador en UERJ.",
      roleClaudio:
        "Responsable de gestionar las actividades de laboratorio de LAPIH y la liofilización y almacenamiento de muestras bacterianas.",
      roleNicolas:
        "Responsable del desarrollo de la nueva versión del front-end de CABGen.",
    },
    AboutContact: {
      sectionTitle: "¿Quieres saber más? ¡Contáctanos!",
      sectionDescription:
        "Si tienes alguna pregunta, estamos aquí para ayudarte. Visita nuestra página de contacto para aprender a usar nuestra herramienta. Completa el formulario o contáctanos por correo electrónico.",
      contactBtn: "Contacto",
    },
  },
  Contact: {
    formSubtitle: "Por favor, deja tu mensaje, pregunta o sugerencia.",
    nameField: "Nombre",
    nameFieldValidation: "El nombre es obligatorio.",
    emailField: "Correo electrónico",
    emailFieldValidationNull: "El correo electrónico es obligatorio.",
    emailFieldValidationValid:
      "Por favor, introduce un correo electrónico válido.",
    institutionField: "Institución",
    institutionFieldValidation: "La institución es obligatoria.",
    subjectField: "Asunto",
    subjectFieldValidation: "El asunto es obligatorio.",
    messageField: "Mensaje",
    messageFieldValidation: "El mensaje es obligatorio.",
    sendBtn: "Enviar",
  },
  Footer: {
    faqLink: "FAQ",
    termLink: "Terminos de Uso",
    imageCredits: "Crédito de Imagen",
  },
};
export default es;
