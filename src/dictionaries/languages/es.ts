const es = {
  Menu: {
    home: "Home",
    network: "Red",
    dashboard: "Dashboard",
    about: "Sobre",
    contact: "Contacto",
    login: "Login",
    logout: "Salir",
    account: "Cuenta",
  },
  close: "Cerrar",
  warnings: {
    developmentVersion:
      "Esta es la versión de desarrollo. Accede a la {link}versión oficial{endLink}.",
    platformInTesting:
      "Plataforma en pruebas. Los registros y datos pueden perderse.",
    maintenance: "Mantenimiento en curso. La plataforma puede estar inestable.",
    adminOnly: "Solo los administradores pueden acceder en este momento.",
    analysisDisabled:
      "La creación de análisis está temporalmente deshabilitada.",
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
      samplesInfoSg: "muestra enviada",
      samplesInfoPl: "muestras enviadas",
      speciesInfoSg: "especie analizada",
      speciesInfoPl: "especies analizadas",
      genesInfoSg: "gen de resistencia detectado",
      genesInfoPl: "genes de resistencia detectados",
      countriesInfoSg: "país remitente",
      countriesInfoPl: "países remitentes",
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
      confessionsOfABacteriaBtn: "Serie Didáctica",
    },
    Financiers: {
      sectionTitle: "Financiadores",
    },
  },
  Network: {
    title: "Red",
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
    lastUpdateWarning: "Última actualización el",
    microreactWarning:
      "Para acceder al Dashboard, desactiva la opción 'Impedir Seguimiento entre Sitios' en Configuración > Privacidad.",
    carbapenemaseBarChart: {
      title: "Distribución de Carbapenemasas por Especie (Top 30)",
      xlabel: "Carbapenemasa",
      ylabel: "Número de Registros",
    },
    aminoglycosidesBarChart: {
      title: "Distribución de Aminoglucósidos por Especie (Top 30)",
      xlabel: "Aminoglucósido",
      ylabel: "Número de Registros",
    },
    quinolonesBarChart: {
      title: "Distribución de Quinolonas por Especie (Top 30)",
      xlabel: "Quinolona",
      ylabel: "Número de Registros",
    },
    sulfonamidesBarChart: {
      title: "Distribución de Sulfonamidas por Especie (Top 30)",
      xlabel: "Sulfonamida",
      ylabel: "Número de Registros",
    },
    polymyxinBarChart: {
      title: "Distribución de Polimixinas por Especie (Top 30)",
      xlabel: "Polimixina",
      ylabel: "Número de Registros",
    },
    resistanceMultiLineChart: {
      title: "Tendencia Anual de Resistencia por Clase de Antimicrobianos",
      xlabel: "Clases de Antimicrobianos",
      ylabel: "Número de Registros",
    },
    map: {
      title: "Distribución de Cepas Resistentes en Brasil",
    },
  },
  About: {
    title: "Acerca de",
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
      roleNicolas: "Responsable del desarrollo de la nueva versión de CABGen.",
    },
    AboutContact: {
      sectionTitle: "¿Quieres saber más? ¡Contáctanos!",
      sectionDescription:
        "Si tienes alguna pregunta, estamos aquí para ayudarte. Visita nuestra página de contacto para aprender a usar nuestra herramienta. Completa el formulario o contáctanos por correo electrónico.",
      contactBtn: "Contacto",
    },
  },
  Contact: {
    title: "Contacto",
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
    successMessage: "Mensaje enviado exitosamente.",
  },
  Login: {
    title: "Iniciar Sesión",
    usernameField: "Nombre de Usuario",
    usernameFieldValidation: "El nombre de usuario es obligatorio.",
    passwordField: "Contraseña",
    passwordFieldValidation: "La contraseña es obligatoria.",
    loginBtn: "Continuar",
    formFooter1: "¿No tienes una cuenta? ",
    formFooter2: "Regístrate.",
    forgotPassword: "¿Olvidaste tu contraseña?",
  },
  ForgotPassword: {
    title: "Olvidé mi Contraseña",
    description:
      "Introduce el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.",
    emailField: "Correo Electrónico",
    emailFieldValidation: "Introduce un correo electrónico válido.",
    button: "Enviar Enlace de Restablecimiento",
    success:
      "Si existe una cuenta con ese correo, se ha enviado un enlace de restablecimiento. Revisa tu bandeja de entrada.",
    backToLogin: "Volver al Inicio de Sesión",
  },
  ResetPassword: {
    title: "Restablecer Contraseña",
    description: "Introduce tu nueva contraseña a continuación.",
    newPasswordField: "Nueva Contraseña",
    newPasswordFieldValidationMinimum:
      "La contraseña necesita al menos 8 caracteres.",
    confirmPasswordField: "Confirmar Contraseña",
    confirmPasswordFieldValidation:
      "La confirmación de contraseña es obligatoria.",
    bothPasswordFieldsValidation: "Las contraseñas no coinciden.",
    button: "Restablecer Contraseña",
    success:
      "Contraseña restablecida correctamente. Ya puedes iniciar sesión.",
    invalidToken:
      "Enlace de restablecimiento inválido o expirado. Solicita uno nuevo.",
    backToLogin: "Volver al Inicio de Sesión",
  },
  Register: {
    title: "Registro",
    nameField: "Nombre",
    nameFieldValidation: "El nombre es obligatorio.",
    countryField: "País",
    countryFieldLabel: "Seleccione un País",
    countryFieldValidation: "El país es obligatorio.",
    usernameField: "Nombre de Usuario",
    usernameFieldValidation: "El nombre de usuario es obligatorio.",
    interestField: "Interés",
    institutionField: "Institución",
    roleField: "Cargo",
    networkField: "¿Parte de la red genómica?",
    networkYes: "Sí",
    networkNo: "No",
    networkHint:
      "La red reúne unidades de Fiocruz, LACEN y CGLAB-MS que secuencian de forma independiente, con análisis estandarizados por CABGen.",
    networkFieldValidation: "Responda si eres parte de la red genómica.",
    emailField: "Correo Electrónico",
    emailFieldValidationNull: "El correo electrónico es obligatorio",
    emailFieldValidationValid:
      "Por favor, introduce un correo electrónico válido.",
    confirmEmailField: "Confirmar Correo Electrónico",
    confirmEmailFieldValidationNull:
      "La confirmación de correo electrónico es obligatoria.",
    confirmEmailFieldValidationValid:
      "Por favor, introduce un correo electrónico válido.",
    passwordField: "Contraseña",
    passwordFieldValidationNull: "La contraseña es obligatoria.",
    passwordFieldValidationMinimum:
      "La contraseña necesita al menos 8 caracteres.",
    confirmPasswordField: "Confirmar Contraseña",
    confirmPasswordFieldValidation:
      "La confirmación de contraseña es obligatoria.",
    bothEmailFieldsValidation: "Los correos electrónicos no coinciden.",
    bothPasswordFieldsValidation: "Las contraseñas no coinciden.",
    registerBtn: "Continuar",
    success: "Registro realizado con éxito.",
    formFooter1: "¿Ya tienes una cuenta? ",
    formFooter2: "Iniciar sesión.",
  },
  Maintenance: {
    sectionTitle: "Mantenimiento en Progreso",
    sectionDescription:
      "Estamos dedicados a mejorar nuestra plataforma para ofrecerle una experiencia aún mejor. Pedimos disculpas por cualquier inconveniente y agradecemos su comprensión. Pronto estaremos de regreso. Mientras tanto, gracias por su paciencia y continúe visitándonos!",
  },
  Footer: {
    faqLink: "FAQ",
    termLink: "Términos de Uso",
    privacyPolicy: "Política de Privacidad",
  },
  FAQ: {
    title: "FAQ",
    subtitle: "Preguntas Frecuentes",
    sections: [
      {
        heading: "Sobre la plataforma",
        items: [
          {
            question: "¿Qué es el CABGen?",
            answer:
              "El CABGen (Clinical Applied Bacterial Genomics Analysis System) es una aplicación web para almacenar, organizar, analizar e interpretar datos de secuenciación de genomas bacterianos. Fue desarrollado en Fiocruz con herramientas de código abierto de forma sencilla, incluso para quienes tienen poca experiencia en bioinformática.",
          },
          {
            question: "¿Qué tipo de datos puedo analizar?",
            answer:
              "Aislados bacterianos de diferentes especies y orígenes. Puede enviar:\n- Lecturas pareadas (R1 y R2) en formato .fastq.gz, generadas en plataformas Illumina; o\n- Contigs ya ensamblados en formato .fasta.",
          },
          {
            question: "¿Qué análisis realiza el CABGen?",
            answer:
              "Calidad de las lecturas, estimación de la profundidad de cobertura del genoma, identificación de especie, ensamblaje de novo del genoma, evaluación de la calidad del ensamblaje, anotación del genoma, tipificación MLST, búsqueda de genes de resistencia a antimicrobianos, de virulencia y de plásmidos, y detección de mutaciones puntuales en genes específicos de resistencia.",
          },
          {
            question: "¿En qué especies se realiza el MLST?",
            answer:
              "El MLST se realiza para todas las especies que tienen un esquema de tipificación registrado en la base de datos PubMLST. Cuando el perfil de alelos aún no está registrado en la base, el resultado aparece como “Nuevo ST”.",
          },
          {
            question:
              "¿Cómo se organiza la información sobre genes de resistencia adquirida?",
            answer:
              "La clase de antimicrobianos a la que el gene confiere resistencia se determina utilizando la base de datos curada “Catálogo de Genes de Referencia del NCBI”. El porcentaje presentado corresponde a la identidad nucleotídica entre la secuencia identificada en la muestra y la secuencia de referencia del alelo. Por ejemplo, una identidad del 100% con blaKPC-2 indica que la secuencia identificada corresponde al alelo blaKPC-2.",
          },
          {
            question:
              "¿Para qué especies el CABGen detecta mutaciones puntuales?",
            answer:
              "Para K. pneumoniae, P. aeruginosa, A. baumannii y E. cloacae subsp. cloacae. Los resultados se dividen entre genes relacionados con la resistencia a polimixina y otras clases de antimicrobianos.",
          },
          {
            question:
              "¿Por qué es importante la información sobre la versión de las herramientas utilizadas en cada análisis?",
            answer:
              "Las herramientas de bioinformática pasan por actualizaciones y mejoras que pueden modificar sus algoritmos, parámetros y métodos de análisis. Además, las bases de datos utilizadas también se actualizan periódicamente. De esta forma, un mismo conjunto de lecturas puede producir resultados diferentes según las versiones de las herramientas y de las bases de datos utilizadas. El registro de esta información es fundamental para garantizar la trazabilidad, la reproducibilidad y la comparabilidad de los resultados.",
          },
        ],
      },
      {
        heading: "Registro y acceso",
        items: [
          {
            question: "¿Cómo obtengo acceso al CABGen?",
            answer:
              "Solicite el registro por el sitio. La solicitud se envía al equipo administrador, que activa su cuenta y responde por correo electrónico.",
          },
          {
            question: "¿Los datos de los pacientes quedan expuestos?",
            answer:
              "No. El CABGen valora la integridad, la privacidad y la confidencialidad de los datos y garantiza la confidencialidad de la información proporcionada por cada usuario. La plataforma no solicita datos de identificación directa del paciente, como el nombre. Las muestras se identifican mediante códigos únicos (número de secuencia, “ID”), utilizados en los análisis y en la presentación de los resultados. Los únicos datos del paciente que se pueden informar son el sexo y la fecha de nacimiento, ambos opcionales. Cuando se completan, se guardan en la base de datos y solo pueden ser vistos y editados por el usuario que registró la muestra y por los administradores de la plataforma.",
          },
          {
            question: "Olvidé mi contraseña. ¿Cómo recupero el acceso?",
            answer:
              "En la pantalla de inicio de sesión, haga clic en “¿Olvidó su contraseña?”, debajo del botón Continuar.\n1. Escriba el correo electrónico asociado a su cuenta.\n2. Haga clic en Enviar enlace de restablecimiento.\n3. Abra el correo recibido y use el enlace para crear una nueva contraseña.\nSi el correo no llega, verifique la carpeta de spam y confirme que la dirección escrita es la misma del registro. Si el problema continúa, comuníquese con el equipo usando el ícono de correo electrónico en la parte superior del sitio.",
          },
        ],
      },
      {
        heading: "Registro de muestras",
        items: [
          {
            question: "¿Cómo registro una muestra individualmente?",
            answer:
              "En el menú lateral, haga clic en Muestras.\n1. Haga clic en + Nueva Muestra.\n2. Complete los metadatos en la ventana que se abre. Los campos con asterisco (*) son obligatorios.\n3. Haga clic en Guardar.\nLa muestra aparecerá en la lista de Muestras.",
          },
          {
            question: "¿Qué metadatos necesito informar?",
            answer:
              "Los campos del formulario son:\n- Obligatorios: Origin Code, Collection Date, Run Date, Origin, Sample Source, Microorganism, Sequencer, Laboratory, Health Service, City, Country, Run Number y la pregunta sobre la red genómica.\n- Opcionales: Gender (Patient) y Date of Birth (Patient).",
          },
          {
            question:
              "¿Qué significa la pregunta “¿Desea incluir esta muestra en la red genómica?”",
            answer:
              "Marque Sí si:\n- la muestra forma parte de la Red Nacional de Vigilancia Genómica de Bacterias Multirresistentes en Brasil; y/o\n- desea que la muestra aparezca en el dashboard del sitio.\nLas muestras incluidas en la red se presentan en el dashboard de vigilancia mensal y contribuyen al monitoreo de la resistencia antimicrobiana en Brasil. Marque No si no desea que la muestra sea incluida.",
          },
          {
            question: "¿Puedo registrar varias muestras a la vez?",
            answer:
              "Sí, usando la hoja de cálculo modelo:\n1. En Muestras, haga clic en Descargar plantilla.\n2. Complete la hoja de cálculo con los metadatos de cada muestra, una por línea. Las columnas con asterisco rojo (*) son obligatorias.\n3. Guarde el archivo.\n4. Vuelva a Muestras, haga clic en Subir tabla y seleccione la hoja de cálculo.\nTodas las muestras de la hoja aparecerán en la sección Samples. Después, solo debe subir las lecturas o el fasta de las muestras.",
          },
          {
            question:
              "Algunas celdas de la hoja de cálculo tienen una lista desplegable. ¿Es normal?",
            answer:
              "Sí. Algunas columnas tienen valores predefinidos. Seleccione una opción de la lista o comience a escribir para filtrar. Si no encuentra la opción adecuada, elija “otros”.",
          },
          {
            question: "¿Puedo editar o eliminar una muestra registrada?",
            answer:
              "Sí. En la columna Acciones, use el ícono de lápiz para editar y el de basura para eliminar.",
          },
        ],
      },
      {
        heading: "Envío de secuencias",
        items: [
          {
            question: "¿Cómo envío los archivos de secuenciación?",
            answer:
              "En Samples, localice la muestra.\n1. En la columna Actions, haga clic en el ícono de subida.\n2. En la ventana Subir Secuencias, seleccione:\n- FastQ1 y FastQ2 (R1 y R2), en fastq.gz; o\n- Fasta, en .fasta.\n3. Haga clic en Subir Secuencias.",
          },
          {
            question: "¿Necesito enviar R1 y R2 y también el FASTA?",
            answer:
              "No. Envíe ya sea las lecturas pareadas (R1 y R2) o el FASTA con los contigs.",
          },
        ],
      },
      {
        heading: "Análisis",
        items: [
          {
            question: "¿Cómo realizo un análisis?",
            answer:
              "En el menú lateral, haga clic en Análisis.\n1. Haga clic en + Nuevo Análisis.\n2. En la ventana Crear Análisis, elija el Tipo de Análisis.\n3. En Muestra, seleccione la muestra registrada y con las secuencias ya enviadas.\n4. Haga clic en Crear Análisis.",
          },
          {
            question:
              "¿Cuál es la diferencia entre los tipos de análisis (Calidad, Genómica y Completa)?",
            answer:
              "- Calidad: control de calidad de las lecturas con FastQC, para evaluar si los datos tienen problemas antes de seguir adelante. Solo genera archivos FastQC.html como resultado.\n- Genómica: análisis bioinformático del genoma (ensamblaje, identificación de especie, anotación, resistencia, virulencia, plásmidos, MLST y mutaciones). Elija esta opción si ha cargado archivos en formato FASTA.\n- Completa: ejecuta el análisis de calidad y el genómico juntos. Elija esta opción si ha cargado archivos en formato FASTQ.",
          },
          {
            question: "¿Puedo analizar varias muestras al mismo tiempo?",
            answer:
              "Sí. Puede crear varios análisis, uno para cada muestra, y estos irán a la fila de procesamiento.",
          },
          {
            question: "¿Cómo acompaño el progreso?",
            answer:
              "En la sección Análisis, la columna Estado muestra el progreso. Cuando el análisis termine, aparecerá Completado. Después de concluir los análisis, enviaremos un correo avisando que el análisis fue completado. Los valores de estado son: Pendiente, En Ejecución, Fallido y Completado.",
          },
          {
            question: "¿Cómo funciona la identificación de especie?",
            answer:
              "El sistema usa el archivo de contigs ensamblados como entrada para el programa Kraken2 y, para los complejos A. baumannii-calcoaceticus, E. cloacae y K. pneumoniae, confirma la especie y subespecie con FastANI.",
          },
          {
            question: "¿Por qué aparecieron dos especies en el resultado?",
            answer:
              "Cuando la contaminación estimada es mayor que 5%, el CABGen muestra las dos especies más representativas, con el número de lecturas atribuido a cada una. Esto indica una posible muestra mixta o contaminada y debe evaluarse con cuidado.",
          },
        ],
      },
      {
        heading: "Resultados y descargas",
        items: [
          {
            question: "¿Cómo visualizo los resultados?",
            answer:
              "En Análisis, cuando el estado esté en Completado, haga clic en el ícono de ojo en la columna Acciones. Se abrirá la página con todos los resultados de la muestra.",
          },
          {
            question: "¿Qué aparece en la página de resultados?",
            answer:
              "- FastQC: enlaces a los informes de calidad de las lecturas (FastQC 1 y FastQC 2).\n- Genómica: completitud, N50, tamaño del genoma, cobertura y contaminación.\n- Especies: especie identificada, especie secundaria y MLST.\n- Virulencia y resistencia: genes de resistencia adquirida, mutaciones asociadas a polimixina, otras mutaciones, plásmidos y factores de virulencia.",
          },
        ],
      },
    ],
  },
  TermsOfUse: {
    title: "Términos de Uso",
    subtitle: "CABGen – Fiocruz",
    sections: [
      {
        heading: "1. Presentación y Aceptación",
        paragraphs: [
          "El CABGen es una plataforma digital desarrollada en el ámbito de la Fundação Oswaldo Cruz (Fiocruz) para apoyo a la investigación científica y a la vigilancia en salud. Al acceder, registrarse o utilizar el CABGen, el usuario declara estar de acuerdo expresamente con estos Términos de Uso y con la Política de Privacidad de la plataforma. Si no está de acuerdo con alguna condición, el uso del sistema debe interrumpirse inmediatamente.",
        ],
      },
      {
        heading: "2. Naturaleza de la Herramienta y Uso Científico",
        paragraphs: [
          "El CABGen se pone a disposición como una herramienta computacional de soporte analítico y técnico para investigadores, profesionales de salud e instituciones autorizadas.",
          "Los resultados generados por los análisis automatizados tienen carácter de soporte a la investigación y a la vigilancia, y corresponde a los usuarios la validación técnico-científica final de la información obtenida.",
        ],
      },
      {
        heading: "3. Propiedad Intelectual y Créditos",
        paragraphs: [
          "Todo el código fuente, diseño, logotipos, marcas institucionales y estructuras de datos desarrollados para el CABGen pertenecen a la Fiocruz y están protegidos por las leyes de propiedad intelectual aplicables.",
          "Créditos de medios: Las fotografías, ilustraciones y demás recursos visuales utilizados en la plataforma cuentan con autorización de uso concedida por sus respectivos titulares. La imagen de la personagem Teri, de la obra Confissões de uma bactéria, se utiliza mediante autorización concedida por la Dra. Ana Paula D’Alincourt Carvalho Assef. Los derechos de autor de las imágenes permanecen perteneciendo a sus respectivos titulares, y se prohíbe la reutilización o reproducción de estos elementos gráficos fuera del contexto de la plataforma CABGen sin autorización previa de los titulares de los derechos.",
        ],
      },
      {
        heading: "4. Conducta del Usuario y Seguridad de la Información",
        paragraphs: ["El usuario se compromete a:"],
        items: [
          "Utilizar la plataforma exclusivamente para fines lícitos, académicos, científicos o institucionales.",
          "Mantener la confidencialidad de sus credenciales de acceso (usuario y contraseña), no compartiéndolas con terceros.",
          "Abstenerse de intentar burlar mecanismos de seguridad, sobrecargar la infraestructura de la plataforma o utilizar scripts automatizados no autorizados (como web scraping malicioso).",
        ],
      },
      {
        heading: "5. Limitación de Responsabilidad",
        paragraphs: [
          "La Fiocruz se esfuerza por mantener el CABGen funcional y seguro, pero no garantiza que el sistema operará sin interrupciones, fallas o errores puntuales.",
          "La institución no se responsabiliza por daños directos o indirectos derivados del uso inadecuado de la herramienta, de fallas de conectividad del usuario o de interpretaciones incorrectas de los resultados analíticos generados.",
        ],
      },
      {
        heading: "6. Cambios en los Términos",
        paragraphs: [
          "Estos Términos de Uso podrán actualizarse periódicamente para reflejar mejoras en el sistema o exigencias legales. La continuidad del uso después de los cambios implica la aceptación de la nueva versión.",
        ],
      },
      {
        heading: "7. Legislación Aplicable y Foro",
        paragraphs: [
          "Estos términos están regidos por las leyes de la República Federativa del Brasil. Cualquier litigio derivado de su aplicación se someterá al Foro de la Justicia Federal – Sección Judicial del Río de Janeiro.",
        ],
      },
    ],
  },
  PrivacyPolicy: {
    title: "Política de Privacidad",
    subtitle: "CABGen – Fiocruz",
    sections: [
      {
        heading: "1. Compromiso con la Privacidad",
        paragraphs: [
          "La Fiocruz valora la privacidad y la protección de los datos personales de sus usuarios, en conformidad con la Ley General de Protección de Datos (LGPD – Ley nº 13.709/2018). Esta Política de Privacidad describe qué información se recoge en el CABGen, cómo se trata y cuáles son los derechos de los usuarios.",
        ],
      },
      {
        heading: "2. Datos Recogidos",
        paragraphs: [
          "Para el funcionamiento y control de acceso del CABGen, podemos recoger:",
        ],
        items: [
          "Datos de registro: Nombre, correo institucional, institución de vinculación y credenciales de acceso proporcionados en el momento del registro o de la autenticación.",
          "Datos de navegación y registros: Dirección IP, registros de acceso (fecha y hora), tipo de navegador y páginas visitadas, utilizados estrictamente para fines de seguridad de la información y auditoría técnica.",
          "Datos de investigación: Secuencias genómicas, metadatos o archivos enviados por el usuario para procesamiento analítico (cuando sea aplicable al alcance de la herramienta).",
        ],
      },
      {
        heading: "3. Finalidad del Tratamiento de los Datos",
        paragraphs: [
          "Los datos recogidos se utilizan exclusivamente para:",
        ],
        items: [
          "Autenticar el acceso del usuario y gestionar permisos en la plataforma.",
          "Prestar soporte técnico y viabilizar la comunicación institucional con los investigadores.",
          "Garantizar la seguridad de la infraestructura de tecnología de la información.",
          "Realizar análisis estadísticos agregados y anonimizados sobre el uso de la plataforma para la mejora continua de los servicios.",
        ],
      },
      {
        heading: "4. Compartición de Información",
        paragraphs: [
          "Los datos personales de los usuarios no se comercializan, ceden ni comparten con terceros para fines comerciales o publicitarios. La compartición podrá ocurrir solo:",
        ],
        items: [
          "Entre el equipo técnico autorizado de la Fiocruz responsable del mantenimiento del proyecto.",
          "Por determinación legal, orden judicial o solicitud de autoridades competentes.",
        ],
      },
      {
        heading: "5. Seguridad de la Información",
        paragraphs: [
          "La Fiocruz adopta salvaguardas técnicas, administrativas y de seguridad de la información compatibles con los estándares de la administración pública federal para proteger los datos contra accesos no autorizados, pérdida, alteración o fuga.",
        ],
      },
      {
        heading: "6. Derechos de los Titulares (LGPD)",
        paragraphs: [
          "De acuerdo con la LGPD, el usuario tiene derecho a solicitar en cualquier momento:",
        ],
        items: [
          "La confirmación de la existencia de tratamiento de sus datos.",
          "El acceso a los datos registrados.",
          "La corrección de datos incompletos, inexactos o desactualizados.",
          "La eliminación de datos personales (observadas las obligaciones legales de guarda documental de la institución).",
        ],
      },
      {
        heading: "7. Contacto",
        paragraphs: [
          "Para dudas, solicitudes o ejercicio de derechos relacionados con esta Política de Privacidad, comuníquese con el equipo gestor del CABGen a través del formulario de contacto de la plataforma.",
        ],
      },
    ],
    contactHint: "¿Tiene preguntas o desea ejercer alguno de sus derechos?",
    contactLink: "Contacto",
  },
  General: {
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    noResults: "Sin resultados",
    toggleToDark: "Activar modo oscuro",
    toggleToLight: "Activar modo claro",
    selectAll: "Seleccionar todas",
    clear: "Limpiar",
    selected: "{count} seleccionadas",
    pagination: {
      previous: "Página anterior",
      next: "Página siguiente",
      page: "Página {page} de {total}",
    },
  },
  ErrorPages: {
    errorTitle: "Algo salió mal",
    errorDescription: "Ocurrió un error inesperado. Intente de nuevo.",
    retry: "Intentar de nuevo",
    notFoundTitle: "Página no encontrada",
    notFoundDescription:
      "La página que buscas no existe o fue movida.",
    backHome: "Volver al inicio",
  },
  Errors: {
    internalServer:
      "Servicio no disponible, por favor inténtelo de nuevo más tarde.",
    downloadError: "Error al descargar archivo. Intente de nuevo.",
    viewError: "Error al acceder al archivo. Intente de nuevo.",
    loadErrorTitle: "Error al cargar datos",
    loadErrorDescription:
      "No se pudieron cargar los datos. Inténtalo de nuevo.",
    retry: "Intentar de nuevo",
  },
  Account: {
    sidebar: {
      overview: "Resumen",
      sequences: "Muestras",
      analysis: "Análisis",
      myAccount: "Mi Cuenta",
      security: "Seguridad",
      admin: "Admin",
      tutorial: "Tutorial",
    },
    sequences: {
      title: "Muestras",
      search: "Buscar...",
      newSample: "Nueva Muestra",
      editSample: "Editar Muestra",
      uploadSequences: "Subir Secuencias",
      downloadTemplate: "Descargar plantilla",
      uploadTable: "Subir tabla",
      uploadTableTitle: "Subir tabla de metadatos de muestras",
      uploadTableHint:
        "Archivo .xlsx de hasta 50 MB. Descargue la plantilla para verificar el formato esperado.",
      uploadTableFile: "Hoja de cálculo (.xlsx)",
      deleteConfirm: "¿Está seguro de que desea eliminar {name}? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      save: "Guardar",
      upload: "Subir",
      delete: "Eliminar",
      view: "Ver",
      edit: "Editar",
      name: "Nombre",
      collectionDate: "Fecha de Recolección",
      runNumber: "Número de Carrera",
      runDate: "Fecha de Carrera",
      city: "Ciudad",
      originCode: "Código de Origen",
      gender: "Género (Paciente)",
      dateOfBirth: "Fecha de Nacimiento (Paciente)",
      country: "País",
      origin: "Origen",
      sampleSource: "Fuente de la Muestra",
      microorganism: "Microorganismo",
      sequencer: "Secuenciador",
      laboratory: "Laboratorio",
      healthService: "Servicio de Salud",
      fastq1: "FastQ1",
      fastq2: "FastQ2",
      fasta: "Fasta",
      actions: "Acciones",
      viewSample: "Ver Muestra",
      network: "Red Genómica",
      isPartOfNetwork: "¿Desea incluir esta muestra en la red genómica?",
      networkYes: "Sí",
      networkNo: "No",
      networkHint:
        "Las muestras incluidas en la red se presentan en el Dashboard mensual de vigilancia, contribuyendo al monitoreo de la resistencia antimicrobiana en Brasil.",
      networkValidation: "Responda si desea incluir la muestra en la red genómica.",
      detail: {
        back: "Volver",
        title: "Detalles de la Muestra",
        user: "Usuario",
        identity: "Identidad",
        classification: "Clasificación",
        personalInfo: "Información Personal",
        files: "Archivos",
      },
      selectPlaceholder: "Seleccionar...",
      noResults: "No se encontraron muestras",
      showing: "{count} resultados",
      validation: { required: "Este campo es obligatorio" },
      optionsLoadError: "No se pudieron cargar las opciones del formulario. Intente recargar la página.",
      compressing: "Comprimiendo archivos...",
      uploading: "Subiendo...",
    },
    analyses: {
      title: "Análisis",
      newAnalysis: "Nuevo Análisis",
      sample: "Muestra",
      type: "Tipo",
      status: "Estado",
      startedAt: "Inicio",
      finishedAt: "Fin",
      totalTime: "Tiempo Total",
      completeness: "Completitud",
      genomeSize: "Tamaño del Genoma",
      n50: "N50",
      identifiedSpecies: "Especie Identificada",
      step: "Paso",
      actions: "Acciones",
      view: "Ver",
      delete: "Eliminar",
      cancel: "Cancelar",
      noResults: "No se encontraron análisis",
      showing: "{count} análisis",
      downloadTsv: "Descargar TSV",
      search: "Buscar...",
      filterBySample: "Buscar por Muestra",
      filterByType: "Filtrar por Tipo",
      filterByUsername: "Filtrar por Usuario",
      filterAll: "Todos",
      deleteConfirm: "¿Está seguro de que desea eliminar este análisis?",
      createAnalysis: "Crear Análisis",
      selectType: "Seleccionar tipo",
      selectSample: "Seleccionar muestra",
      validation: { required: "Este campo es obligatorio" },
      statusValues: { pending: "Pendiente", running: "En Ejecución", done: "Completado", failed: "Falló" },
      detail: {
        title: "Resultados del Análisis",
        back: "Volver a análisis",
        fastqc: "FastQC",
        genomic: "Genómica",
        species: "Especies",
        virulence: "Virulencia",
        fastqc1: "FastQC 1",
        fastqc2: "FastQC 2",
        downloadResults: "Descargar Resultados",
        downloading: "Descargando…",
        metrics: {
          coverage: "Cobertura",
          completeness: "Completitud",
          contamination: "Contaminación",
          genomeSize: "Tamaño del Genoma",
          contigs: "Contigs",
          n50: "N50",
          identifiedSpecies: "Especie Identificada",
          secondarySpecies: "Especie Secundaria",
          mlst: "MLST",
          mlstNewST: "(Nuevo ST)",
          mlstNotAvailable: "No disponible para esta especie",
          poliMutations: "Mutaciones Polimixina",
          otherMutations: "Otras Mutaciones",
          acquiredResistance: "Resistencia Adquirida",
          vfdb: "VFDB",
          plasmid: "Plásmido",
          desc: {
            completeness: "Porcentaje de completitud del genoma ensamblado",
            n50: "Contig más grande donde la mitad de los nucleótidos están en contigs de longitud igual o mayor",
            genomeSize: "Tamaño total del genoma en pares de bases",
            contigs: "Número de contigs (secuencias contiguas) del genoma ensamblado",
            coverage: "Profundidad promedio de cobertura del secuenciamiento",
            contamination: "Nivel de contaminación estimado",
            identifiedSpecies: "Especie identificada por el pipeline",
            secondarySpecies: "Especie secundaria, mostrada cuando se supera el umbral de contaminación",
            mlst: "Tipo de secuencia multi-locus asignado al aislado",
            acquiredResistance: "Genes de resistencia adquirida detectados",
            poliMutations: "Mutaciones asociadas a la resistencia a polimixinas",
            otherMutations: "Otras mutaciones de interés clínico detectadas",
            plasmid: "Plasmidos identificados en el genoma",
            vfdb: "Factores de virulencia detectados",
          },
        },
        versions: "Versiones de Herramientas",
      },
    },
    admin: {
      overview: {
        title: "Panel de Admin",
        statistics: "Estadísticas",
        totalSamples: "Total de Muestras",
        totalAnalyses: "Total de Análisis",
        totalUsers: "Total de Usuarios",
        totalCountries: "Total de Países",
        totalSpecies: "Total de Especies",
        totalResistanceGenes: "Genes de Resistencia",
        analysesByStatus: "Análisis por Estado",
        topCountries: "Principales Países",
        speciesBreakdown: "Distribución por Especie",
        count: "Conteo",
        others: "Otros",
        analysesByType: "Análisis por Tipo",
        duration: "Duración de Análisis (min)",
        avgDuration: "Duración promedio",
        p95Duration: "Duración P95",
        minute: "minuto",
        minutes: "minutos",
        samplesInNetwork: "Muestras en la Red Genómica",
        usersInNetwork: "Usuarios en la Red Genómica",
        topResistanceGenes: "Genes de Resistencia (Top 10)",
        samplesByMonth: "Muestras por Mes",
        queueWait: "Espera en Cola (min)",
        avgWait: "Promedio",
      },
      search: "Buscar...",
      users: "Usuarios",
      origins: "Orígenes",
      sequencers: "Secuenciadores",
      sampleSources: "Fuentes de Muestras",
      healthServices: "Servicios de Salud",
      microorganisms: "Microorganismos",
      laboratories: "Laboratorios",
      allSamples: "Muestras",
      allAnalyses: "Análisis",
      audit: {
        title: "Auditoría",
        event: "Evento",
        source: "Fuente",
        status: "Estado",
        date: "Fecha",
        metadata: "Metadatos",
        filterBySource: "Buscar por Fuente...",
        filterByStatus: "Buscar por Estado...",
        filterByDate: "Filtrar por Fecha",
        filterByUser: "Filtrar por Usuario",
        filterByEvent: "Filtrar por Evento",
        noAudit: "No se encontraron registros de auditoría",
        showingAudit: "{count} registros",
        clearFilters: "Limpiar filtros",
      },
      name: "Nombre",
      username: "Nombre de usuario",
      email: "Correo electrónico",
      country: "País",
      userRole: "Rol",
      isActive: "Activo",
      network: "Red Genómica",
      isPartOfNetwork: "¿Parte de la red genómica?",
      activatedBy: "Activado Por",
      activatedOn: "Activado En",
      password: "Contraseña",
      interest: "Interés",
      role: "Rol",
      institution: "Institución",
      newUser: "Nuevo Usuario",
      editUser: "Editar Usuario",
      id: "ID",
      createUser: "Crear Usuario",
      save: "Guardar",
      actions: "Acciones",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      noResults: "No se encontraron usuarios",
      showing: "{count} usuarios",
      deleteConfirm: "¿Está seguro de que desea eliminar {name}?",
      selectPlaceholder: "Seleccionar...",
      validation: { required: "Este campo es obligatorio" },
      activeValues: { yes: "Sí", no: "No" },
      activate: "Activar",
      deactivate: "Desactivar",
      roleValues: { Admin: "Administrador", Collaborator: "Colaborador" },
      healthServiceTypeValues: { Public: "Público", Private: "Privado" },
      newOrigin: "Nuevo Origen",
      editOrigin: "Editar Origen",
      createOrigin: "Crear Origen",
      noOrigins: "No se encontraron orígenes",
      showingOrigins: "{count} orígenes",
      names: { pt: "Nombre en Portugués", en: "Nombre en Inglés", es: "Nombre en Español" },
      newSequencer: "Nuevo Secuenciador",
      editSequencer: "Editar Secuenciador",
      createSequencer: "Crear Secuenciador",
      noSequencers: "No se encontraron secuenciadores",
      showingSequencers: "{count} secuenciadores",
      model: "Modelo",
      brand: "Marca",
      newLaboratory: "Nuevo Laboratorio",
      editLaboratory: "Editar Laboratorio",
      createLaboratory: "Crear Laboratorio",
      noLaboratories: "No se encontraron laboratorios",
      showingLaboratories: "{count} laboratorios",
      abbreviation: "Abreviatura",
      newHealthService: "Nuevo Servicio de Salud",
      editHealthService: "Editar Servicio de Salud",
      viewHealthService: "Ver Servicio de Salud",
      createHealthService: "Crear Servicio de Salud",
      noHealthServices: "No se encontraron servicios de salud",
      showingHealthServices: "{count} servicios de salud",
      type: "Tipo",
      city: "Ciudad",
      contactant: "Contacto",
      contactEmail: "Correo de Contacto",
      contactPhone: "Teléfono de Contacto",
      newSampleSource: "Nueva Fuente de Muestra",
      editSampleSource: "Editar Fuente de Muestra",
      createSampleSource: "Crear Fuente de Muestra",
      noSampleSources: "No se encontraron fuentes de muestra",
      showingSampleSources: "{count} fuentes de muestras",
      group: "Grupo",
      newMicroorganism: "Nuevo Microorganismo",
      editMicroorganism: "Editar Microorganismo",
      createMicroorganism: "Crear Microorganismo",
      noMicroorganisms: "No se encontraron microorganismos",
      showingMicroorganisms: "{count} microorganismos",
      taxon: "Taxón",
      species: "Especie",
      variety: "Variedad",
      taxonValues: {
        Bacteria: "Bacteria",
        Virus: "Virus",
        Protozoa: "Protozoa",
        Fungi: "Hongos",
      },
      tickets: "Tickets",
      noTickets: "No se encontraron tickets",
      showingTickets: "{count} tickets",
      filterValues: { My: "Mis Tickets", Open: "Abiertos", Resolved: "Resueltos", All: "Todos" },
      assign: "Asignar",
      resolve: "Resolver",
      view: "Ver",
      message: "Mensaje",
      adminLabel: "Administrador",
      subject: "Asunto",
      status: "Estado",
      createdAt: "Creado En",
      ticketStatusValues: {
        OPEN: "Abierto",
        IN_PROGRESS: "En Progreso",
        RESOLVED: "Resuelto",
      },
      newSample: "Nueva Muestra",
      editSample: "Editar Muestra",
      createSample: "Crear Muestra",
      noSamples: "No se encontraron muestras",
      showingSamples: "{count} muestras",
      user: "Usuario",
      newAnalysis: "Nuevo Análisis",
      editAnalysis: "Editar Análisis",
      createAnalysis: "Crear Análisis",
      noAnalyses: "No se encontraron análisis",
      showingAnalyses: "{count} análisis",
      downloadTsv: "Descargar TSV",
      downloadDashboardTsv: "Descargar dashboard TSV",
      metrics: "Métricas",
      resultsZipPath: "Ruta del ZIP de Resultados",
    },
    myAccount: {
      title: "Mi Cuenta",
      editProfile: "Editar Perfil",
      email: "Correo electrónico",
      name: "Nombre",
      username: "Nombre de usuario",
      country: "País",
      institution: "Institución",
      position: "Cargo",
      interest: "Área de Interés",
      network: "Red Genómica",
      language: "Idioma",
      role: "Rol",
      roleAdmin: "Administrador",
      roleCollaborator: "Colaborador",
      save: "Guardar",
      saveSuccess: "Perfil actualizado exitosamente.",
      selectPlaceholder: "Seleccionar...",
      validation: { required: "Este campo es obligatorio" },
    },
    security: {
      title: "Seguridad",
      changeEmail: "Cambiar Correo Electrónico",
      changeEmailDescription: "Se enviará un enlace de verificación a su nueva dirección de correo electrónico.",
      changePassword: "Cambiar Contraseña",
      changePasswordDescription: "Actualice la contraseña de su cuenta.",
      deleteAccount: "Eliminar Cuenta",
      deleteAccountDescription: "Eliminar permanentemente su cuenta y todos los datos asociados. Esta acción no se puede deshacer.",
      deleteConfirm: "¿Está seguro? Esta acción no se puede deshacer.",
      deleteNetworkImportanceTitle: "Tus muestras y análisis son esenciales",
      deleteNetworkImportance:
        "Las muestras y análisis que compartes son esenciales para la vigilancia de la resistencia antimicrobiana (RAM) y para el control de la propagación de bacterias multirresistentes en Brasil.",
      deleteNetworkBlocked:
        "Tu cuenta es parte de la Red Genómica. Para eliminar tu cuenta, contacta a un administrador.",
      contact: "Contacto",
      cancel: "Cancelar",
      delete: "Eliminar",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Contraseña",
      confirmNewEmail: "Confirmar Nuevo Correo Electrónico",
      sendVerification: "Enviar Verificación",
      newEmail: "Nuevo Correo Electrónico",
      save: "Guardar",
      changePasswordSuccess: "Contraseña actualizada exitosamente.",
      requestEmailSuccess: "Correo de verificación enviado. Revise su bandeja de entrada.",
      comingSoon: "Próximamente",
      deleteSuccess: "Cuenta eliminada exitosamente.",
      confirmEmailTitle: "Confirmación de Correo Electrónico",
      confirmEmailLoading: "Confirmando el cambio de correo electrónico...",
      confirmEmailSuccess: "Correo electrónico actualizado exitosamente.",
      confirmEmailError: "Token inválido o expirado.",
      backToSecurity: "Volver a Seguridad",
      validation: {
        required: "Este campo es obligatorio",
        email: "Dirección de correo electrónico inválida",
        match: "Los campos no coinciden",
        passwordMinLength: "La contraseña necesita al menos 8 caracteres.",
        passwordDifferent: "La nueva contraseña debe ser diferente de la actual.",
      },
    },
    option: {
      analysis_type: {
        fastqc: "Calidad",
        genome: "Genómica",
        complete: "Completo",
      },
      laboratory: { other: "Otro" },
      city: { other: "Otra" },
      healthService: { other: "Otro" },
      sequencer: { other: "Otro" },
      microorganism: { other: "Otro" },
    },
    overview: {
      title: "Cuenta",
      welcome: "Bienvenido",
      totalSamples: "Total de Muestras",
      totalAnalyses: "Total de Análisis",
      analysesDone: "Análisis Completados",
      byStatus: "Análisis por Estado",
      byType: "Análisis por Tipo",
      topSpecies: "Principales Especies",
      topResistanceGenes: "Genes de Resistencia (Top 10)",
      duration: "Duración de Análisis (min)",
      avgDuration: "Duración promedio",
      p95Duration: "Duración P95",
      samplesByMonth: "Muestras por Mes",
      minute: "minuto",
      minutes: "minutos",
      count: "Conteo",
      others: "Otros",
    },
  },
};
export default es;
