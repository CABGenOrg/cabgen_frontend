const pt = {
  Menu: {
    home: "Home",
    network: "Rede",
    dashboard: "Dashboard",
    about: "Sobre",
    contact: "Contato",
    login: "Login",
  },
  Home: {
    WarningBanner: {
      title:
        "Este site agora é apenas para fins de desenvolvimento. Visite nosso novo site em",
    },
    Banner: {
      bannerTitle: "CABGen: Genômica Bacteriana Aplicada à Clínica",
    },
    CabgenDescription: {
      description:
        "Plataforma digital que integra ferramentas para análise de dados de sequenciamento genômico de bactérias, capaz de organizar, armazenar e disponibilizar os resultados obtidos através de formas eficientes de visualização.",
      articleBtn: "Artigo",
    },
    Statistics: {
      sectionTitle: "CABGen em números:",
      sectionSubtitle: "Estatística e Impacto",
      sectionDescription:
        "Desde o seu lançamento, o CABGen tem atraído interesse crescente, com um número relevante de genomas submetidos, abordando uma variedade de espécies bacterianas. Diversos genes de resistência adquirida já foram identificados. O CABGen já recebeu contribuições de diferentes países, refletindo sua natureza colaborativa e global. Essas estatísticas preliminares destacam o potencial do CABGen para impulsionar avanços na pesquisa genômica e na saúde pública, fornecendo uma base sólida para futuras e descobertas.",
      loginBtn: "Começar",
    },
    BoxInfo: {
      genomesInfo: "genomas submetidos",
      speciesInfo: "espécies analisadas",
      genesInfo: "genes de resistência detectados",
      countriesInfo: "países submissores",
    },
    GenomicSurveillance: {
      sectionTitle: "REDE NACIONAL DE VIGILÂNCIA GENÔMICA DE",
      sectionSubtitle: "BACTÉRIAS MULTIRRESISTENTES NO BRASIL",
      sectionDescription:
        "Rede que integra laboratórios brasileiros para realização de sequenciamento genômico de bactérias produtoras de carbapenemases para obtenção de informações relevantes para o controle da disseminação desses microrganismos.",
      learMoreBtn: "Saiba mais",
    },
    AntimicrobialResistance: {
      sectionTitle: "O que é",
      sectionSubtitle: "Resistência Antimicrobiana",
      sectionDescription:
        "A resistência antimicrobiana (RAM) representa uma ameaça global à eficácia dos tratamentos para infecções causadas por microrganismos como vírus, bactérias, fungos e parasitas. Essa resistência surge quando esses microrganismos sofrem mutações ou adquirem novos genes que os tornam resistentes ào tratamento. Patógenos bacterianos prevalentes em hospitais apresentam taxas preocupantes de resistência, prolongando as infecções, aumentando o risco de propagação e os custos hospitalares. Esse cenário exige ação conjunta de todos os setores da sociedade e do governo. A RAM não reconhece fronteiras e afeta não apenas a saúde humana, mas também a saúde animal, a produtividade agrícola e a segurança alimentar.",
      omsBtn: "OMS",
      nationalPlanBtn: "Plano Nacional",
      confessionsOfABacteriaBtn: "Série Didática",
    },
    Financiers: {
      sectionTitle: "Financiadores",
    },
  },
  Network: {
    Description: {
      firstParagraph:
        "A rede reúne especialistas em resistência antimicrobiana (RAM) e bioinformática de diferentes unidades da Fiocruz, LACEN e CGLAB-MS, tendo como foco principal a estruturação, capacitação, análise e interpretação de dados de sequenciamento total de genomas de bactérias multirresistentes. Essa iniciativa permitirá a compreensão mais profunda sobre o cenário da RAM no Brasil, com a intenção de garantir agilidade para futuras ações no controle da disseminação desses microrganismos.",
      secondParagraph:
        "Cada laboratório participante da rede realiza o sequenciamento de forma independente, e as análises dos dados gerados são padronizadas e automatizadas através do CABGen. As informações geradas pelos integrantes da rede estão disponíveis de forma visual e interativa no CABGen, permitindo a comunicação dos resultados para a comunidade científica e profissionais da saúde.",
      thirdParagraphFirstPart:
        "O foco inicial da rede é o estudo das espécies de bacilos gram-negativos multirresistentes",
      thirdParagraphSecondPart:
        "Pseudomonas aeruginosa, Acinetobacter baumannni e Klebsiella pneumoniae",
      thirdParagraphThirdPart:
        ", produtores de carbapenemases. Essas amostras são incluídas na Coleção de Culturas de Bactérias de Origem Hospitalar (CCBH/IOC - WDCM 947), para preservação das culturas bacterianas. Além disso, os dados genômicos ficam protegidos em um servidor próprio hospedado na Fiocruz/RJ, em uma sala cofre certificada segundo a NBR 15247. A rede está aberta para formalização de novos parceiros. Caso tenho interesse entrar em contato.",
      contactBtn: "Contato",
      dashboardBtn: "Dashboard",
    },
    Map: {
      sectionTitle: "Integrantes Atuais",
    },
  },
  Dashboard: {
    sectionTitle: "Dados da Rede Genômica",
    microreactWarning:
      "Para acessar o Dashboard, desative a opção 'Impedir Rastreamento entre Sites' em Ajustes > Privacidade.",
    barChart: {
      title: "Distribuição de Carbapenemases por Espécie",
      xlabel: "Carbapenemase",
      ylabel: "Número de Entradas",
    },
    map: {
      title: "Distribuição de Cepas Resistentes no Brasil",
    }
  },
  About: {
    CabgenMission: {
      sectionTitle: "Entenda o ",
      sectionSubtitle: "Missão e Propósito",
      sectionDescriptionFirstParagraph:
        "O CABGen surge como uma solução para os desafios enfrentados diante do aumento exponencial de dados gerados pelo sequenciamento genômico de bactérias resistentes aos antimicrobianos (RAM). Em resposta à urgência em combater a RAM e preencher a lacuna entre a geração e análise de dados genômicos, o CABGen oferece funcionalidades essenciais, como identificação de espécie, detecção de genes e mutações relacionadas à resistências, atribuição de um perfil clonal e a verificação da existência de plasmídeos. Essas ferramentas simplificam e aprimoram a análise e interpretação de dados biológicos, fornecendo insights valiosos para aplicações clínicas.",
      sectionDescriptionSecondParagraph:
        "Ademais, o sistema está em constante evolução para atender às demandas crescentes, com planos para a instalação de um novo servidor que permitirá até 60 análises em paralelo, além de um armazenamento robusto capaz de suportar até 120 mil amostras. A segurança do CABGen é garantida tanto pelo firewall da rede do Programa de Computação Científica (PROCC) quanto pelas rigorosas políticas de segurança da FioCruz.",
      articleBtn: "Artigo",
    },
    CabgenPipeline: {
      sectionTitle: "Por dentro do ",
    },
    CabgenResults: {
      sectionTitle: "Resultados do ",
    },
    Team: {
      sectionTitle: "Conheça nossos profissionais",
      roleAnaPaula:
        "Responsável por coordenar o projeto, analisar os resultados fenotípicos, moleculares e de sequenciamento e enviar os resultados para o sistema Gerenciamento de Ambiente de Laboratório (GAL).",
      roleFabricio:
        "Responsável por gerenciar a utilização do servidor da Fiocruz para montagem de genomas e desenvolvimento do banco de dados para disponibilização de genomas.",
      roleFelicita:
        "Doutoranda do Programa de Biologia Computacional e Sistemas do Doutorado em Ciências da Saúde Cooperação internacional entre a Fundação Oswaldo Cruz e o Focem-Mercosul - Paraguai.",
      roleMelise:
        "Responsável pela análise dos resultados obtidos no sequenciamento de todo o genoma.",
      roleRodolpho: "Pesquisador da UERJ.",
      roleClaudio:
        "Responsável pelo gerenciamento das atividades laboratoriais do LAPIH e liofilização e armazenamento de amostras bacterianas.",
      roleNicolas:
        "Responsável pelo desenvolvimento da nova versão do front-end do CABGen.",
    },
    AboutContact: {
      sectionTitle: "Deseja saber mais? Fale conosco!",
      sectionDescription:
        "Se surgir alguma dúvida, estamos aqui para ajudar. Visite nossa página de contato para aprender a usar a nossa ferramenta. Preencha o formulário ou entre em contato por e-mail.",
      contactBtn: "Contato",
    },
  },
  Contact: {
    formSubtitle: "Por favor, deixe sua mensagem, dúvida ou sugestão.",
    nameField: "Nome",
    nameFieldValidation: "O nome é obrigatório.",
    emailField: "E-mail",
    emailFieldValidationNull: "O e-mail é obrigatório",
    emailFieldValidationValid: "Insira um e-mail válido.",
    institutionField: "Instituição",
    institutionFieldValidation: "A instituição é obrigatória.",
    subjectField: "Assunto",
    subjectFieldValidation: "O assunto é obrigatório.",
    messageField: "Mensagem",
    messageFieldValidation: "A mensagem é obrigatória.",
    sendBtn: "Enviar",
  },
  Login: {
    usernameField: "Nome de Usuário",
    usernameFieldValidation: "O nome de usuário é obrigatório.",
    passwordField: "Senha",
    passwordFieldValidation: "A senha é obrigatória.",
    loginBtn: "Continuar",
    formFooter1: "Não possui conta? ",
    formFooter2: "Cadastre-se.",
  },
  Register: {
    nameField: "Nome",
    nameFieldValidation: "O nome é obrigatório.",
    countryField: "País",
    countryFieldLabel: "Selecione um País",
    countryFieldValidation: "O país é obrigatório.",
    usernameField: "Nome de Usuário",
    usernameFieldValidation: "O nome de usuário é obrigatório.",
    interestField: "Interesse",
    institutionField: "Instituição",
    roleField: "Cargo",
    emailField: "E-mail",
    emailFieldValidationNull: "O e-mail é obrigatório",
    emailFieldValidationValid: "Insira um e-mail válido.",
    confirmEmailField: "Confirme o e-mail",
    confirmEmailFieldValidationNull: "A confirmação de e-mail é obrigatória.",
    confirmEmailFieldValidationValid: "Insira um e-mail válido.",
    passwordField: "Senha",
    passwordFieldValidationNull: "A senha é obrigatória.",
    passwordFieldValidationMinimum:
      "A senha precisa de pelo menos 8 caracteres.",
    confirmPasswordField: "Confirme a senha",
    confirmPasswordFieldValidation: "A confirmação de senha é obrigatória.",
    bothEmailFieldsValidation: "Os e-mails não são iguais.",
    bothPasswordFieldsValidation: "As senhas não são iguais.",
    registerBtn: "Continuar",
    formFooter1: "Já possui conta? ",
    formFooter2: "Faça login.",
  },
  Maintenance: {
    sectionTitle: "Manutenção em andamento",
    sectionDescription:
      "Estamos dedicados a aprimorar nossa plataforma para oferecer uma experiência ainda melhor a você. Pedimos desculpas por qualquer inconveniente e agradecemos sua compreensão. Em breve estaremos de volta. Até lá, obrigado pela paciência e continue nos visitando!",
  },
  Footer: {
    faqLink: "FAQ",
    termLink: "Termos de Uso",
    imageCredits: "Créditos das Imagens",
  },
};
export default pt;
