import { CourseEvent, NewsPost, ImpactStory, TransparencyDoc, Partner, TeamMember, ContactMessage, AdminProfile } from '../types';

export const courseEvents: CourseEvent[] = [
  {
    id: '1',
    slug: 'informatica-basica',
    title: 'Informática Básica e Inclusão Digital',
    description: 'Curso focado em capacitar jovens e adults da comunidade no uso de computadores, internet, ferramentas de escritório (Word, Excel) e introdução à navegação segura, abrindo portas para o mercado de trabalho.',
    date: '15 Mar 2026',
    time: '14:00 - 17:00',
    location: 'Praça da Cidadania Osasco - Sala de TI',
    locationName: 'Praça da Cidadania Osasco',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    category: 'capacitacao',
    status: 'upcoming',
    statusText: 'inscricoes-abertas',
    spotsTotal: 25,
    spotsLeft: 8,
    workload: '40 horas',
    modality: 'presencial',
    shift: 'tarde',
    syllabus: [
      'Conceitos básicos de hardware, software e sistemas operacionais',
      'Navegação segura na internet e uso responsável de e-mails',
      'Processamento de textos profissional (Word e documentos do Google)',
      'Fundamentos de planilhas eletrônicas (Excel e planilhas do Google)',
      'Organização de arquivos na nuvem e ferramentas de colaboração online'
    ]
  },
  {
    id: '2',
    slug: 'panificacao-comunitaria',
    title: 'Oficina de Panificação e Confeitaria Comunitária',
    description: 'Aprenda técnicas de panificação e confeitaria artesanal com profissionais da área. Uma oportunidade excelente para aprender a produzir pães e doces para consumo próprio ou para gerar renda familiar.',
    date: '28 Mar 2026',
    time: '08:30 - 12:30',
    location: 'Cozinha-Escola Doce Mensageiro - Polo Lapa',
    locationName: 'Cozinha-Escola Doce Mensageiro',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    category: 'socioeducativo',
    status: 'upcoming',
    statusText: 'lista-espera',
    spotsTotal: 15,
    spotsLeft: 0,
    workload: '60 horas',
    modality: 'presencial',
    shift: 'manha',
    syllabus: [
      'Boas práticas de manipulação e higiene de alimentos em cozinhas profissionais',
      'Técnicas fundamentais de fermentação biológica e fermentação natural (levain)',
      'Modelagem, sova e assamento de pães doces, salgados e folhados',
      'Confeitaria básica: massas de bolo, recheios tradicionais e coberturas',
      'Noções de custos, precificação de produtos para venda autônoma e rotulagem'
    ]
  },
  {
    id: '3',
    slug: 'bazar-outono',
    title: 'Bazar Beneficente Especial de Outono',
    description: 'Edição especial do nosso bazar beneficente anual. Toda a arrecadação será revertida para a compra de cestas básicas e melhorias na infraestrutura do nosso centro de convivência infantil.',
    date: '10 Abr 2026',
    time: '09:00 - 17:00',
    location: 'Sede Lapa - Quadra Poliesportiva',
    locationName: 'Sede Lapa',
    imageUrl: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?q=80&w=800&auto=format&fit=crop',
    category: 'evento',
    status: 'upcoming',
    statusText: 'inscricoes-abertas',
    workload: '8 horas',
    modality: 'presencial',
    shift: 'sabado',
    syllabus: [
      'Triagem e seleção ética de vestuários e utensílios doados',
      'Organização logística de araras, precificação social e recepção',
      'Atendimento solidário a famílias e integração comunitária',
      'Soma de arrecadação financeira e prestação de contas pública'
    ]
  },
  {
    id: '4',
    slug: 'apoio-escolar',
    title: 'Apoio Escolar e Letramento Criativo',
    description: 'Acompanhamento pedagógico contínuo para crianças do ensino fundamental I, integrando contação de histórias, jogos educativos e auxílio nas lições de casa diárias.',
    date: 'Segunda a Sexta-feira',
    time: '13:30 - 16:30',
    location: 'Casinha Azul Vila Yolanda - Sala de Estudos',
    locationName: 'Casinha Azul Vila Yolanda',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    category: 'socioeducativo',
    status: 'ongoing',
    statusText: 'encerrado',
    workload: '120 horas',
    modality: 'presencial',
    shift: 'tarde',
    syllabus: [
      'Revisão pedagógica de português (leitura, escrita e interpretação)',
      'Reforço de matemática básica (quatro operações e raciocínio lógico)',
      'Oficinas de artes visuais, colagem e contação de histórias criativas',
      'Desenvolvimento de habilidades de socialização e respeito mútuo'
    ]
  },
  {
    id: '5',
    slug: 'marketing-digital-micro',
    title: 'Workshop de Marketing Digital para Pequenos Negócios',
    description: 'Aprenda a divulgar seus produtos e serviços na internet utilizando ferramentas gratuitas e acessíveis pelo seu celular. Focado em microempreendedores locais.',
    date: '05 Mai 2026',
    time: '19:00 - 21:30',
    location: 'Online via Plataforma de Vídeo',
    locationName: 'Mensageiros Cast',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    category: 'capacitacao',
    status: 'upcoming',
    statusText: 'inscricoes-abertas',
    spotsTotal: 50,
    spotsLeft: 34,
    workload: '12 horas',
    modality: 'online',
    shift: 'noite',
    syllabus: [
      'Configuração profissional do WhatsApp Business e Catálogo de Produtos',
      'Criação de perfis comerciais atraentes no Instagram e Facebook',
      'Técnicas de fotografia e vídeo de mercadorias usando a câmera do celular',
      'Escrita persuasiva básica (copywriting) para posts e mensagens de vendas',
      'Como planejar pequenas campanhas de anúncios locais georreferenciados'
    ]
  }
];

export const newsPosts: NewsPost[] = [
  {
    id: '1',
    slug: 'nova-sala-de-informatica',
    title: 'Mensageiros da Esperança inaugura nova Sala de Informática',
    excerpt: 'Com a parceria estratégica do Instituto Inovação Sustentável, a comunidade agora conta com 15 computadores modernos e internet banda larga de alta velocidade.',
    content: 'Temos o orgulho de anunciar a tempo a inauguração da nossa nova Sala de Inclusão Digital. Esse espaço foi projetado para oferecer acesso gratuito à internet, capacitação tecnológica e mentorias profissionais para jovens e adultos do bairro. O projeto foi viabilizado através do aporte do Instituto Inovação Sustentável e doações da comunidade civil. Os novos computadores permitirão triplicar o número de alunos atendidos anualmente em nossos cursos livres e preparatórios.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    category: 'Impacto',
    date: '20 Fev 2026',
    author: 'Juliana Costa',
    readTime: '3 min de leitura',
    featured: true,
    publishedStatus: 'publicado',
  },
  {
    id: '2',
    slug: 'campanha-agasalho-2026',
    title: 'Campanha de Agasalho 2026 atende mais de 180 famílias',
    excerpt: 'Graças ao engajamento de nossos voluntários e doadores, conseguimos arrecadar mais de 600 cobertores e agasalhos na primeira fase da campanha.',
    content: 'O inverno se aproxima e a solidariedade aquece vidas. A primeira fase da Campanha de Agasalho 2026 foi um sucesso absoluto. Foram arrecadados e distribuídos agasados infantis, mantas e cobertores de alta qualidade para 185 famílias cadastradas em nossos programas de assistência social direta. Agradecemos a todos que doaram nos pontos de coleta parceiros. A campanha continua ativa e novas distribuições ocorrerão nas próximas semanas.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    category: 'Eventos e Campanhas',
    date: '15 Fev 2026',
    author: 'Marcos Oliveira',
    readTime: '4 min de leitura',
    featured: false,
    publishedStatus: 'publicado',
  },
  {
    id: '3',
    slug: 'esporte-transformando-vidas',
    title: 'Como o esporte tem transformado a vida de crianças na comunidade',
    excerpt: 'Projeto de futebol e artes marciais reduz a evasão escolar e promove integração social e saúde no contraturno escolar.',
    content: 'Nosso projeto esportivo "Mover a Vida" completa dois anos com dados impressionantes: 95% dos participantes frequentes apresentaram melhoria em suas notas escolares e frequência de aulas. Além do desenvolvimento físico e motor, os jovens aprendem lições valiosas de disciplina, respeito mútuo e trabalho em equipe. Conheça as histórias das nossas crianças e saiba como contribuir com equipamentos esportivos ou apadrinhando um atleta juvenil.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    category: 'Artigos',
    date: '02 Fev 2026',
    author: 'Ricardo Mendes',
    readTime: '5 min de leitura',
    featured: false,
    publishedStatus: 'rascunho',
  }
];

export const impactStories: ImpactStory[] = [
  {
    id: '1',
    name: 'Maria do Socorro Souza',
    age: 42,
    role: 'empreendedor',
    project: 'Panificação Comunitária',
    quote: 'A Mensageiros da Esperança me deu mais do que uma receita de pão; eles me devolveram a dignidade de poder colocar comida na mesa com o meu próprio suor.',
    story: 'Após perder o emprego formal na pandemia, Maria encontrou dificuldades para reingressar no mercado devido à idade e falta de qualificação específica. Ao participar do curso de Panificação Comunitária da Mensageiros da Esperança, ela não apenas aprendeu uma profissão, mas também recebeu suporte empreendedor. Hoje ela produz e comercializa pães artesanais sob encomenda, sustentando sua casa de forma independente.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    lgpdConsent: true,
  },
  {
    id: '2',
    name: 'Carlos Eduardo Lima',
    age: 21,
    role: 'voluntario',
    project: 'Inclusão Digital',
    quote: 'Comecei querendo aprender a usar o Word e hoje crio sistemas reais. Fazer parte da equipe de voluntários foi o que transformou meu destino profissional.',
    story: 'Carlos entrou na organização como aluno do curso de informática básica. Demonstrando grande aptidão técnica e dedicação para ajudar os colegas mais velhos, ele foi convidado a se tornar monitor voluntário do projeto. A experiência prática no ensino de tecnologias inspirou Carlos a ingressar na faculdade de Análise e Desenvolvimento de Sistemas. Atualmente, ele concilia o voluntariado com o estágio em uma multinacional de software.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    lgpdConsent: true,
  },
  {
    id: '3',
    name: 'Helena Pires Camargo',
    age: 58,
    role: 'parceiro',
    project: 'Bazar Beneficente',
    quote: 'Apoiar o trabalho da Mensageiros é ver a solidariedade acontecer a poucos metros da minha janela. Cada centavo investido gera transformações reais no olhar das nossas crianças.',
    story: 'Moradora vizinha da sede, dona Helena começou ajudando a organizar as prateleiras de doações no bazar beneficente. Impressionada com a lisura operacional e o impacto nítido nas crianças do bairro, ela decidiu formalizar doações financeiras mensais e mobilizou sua rede de contatos profissionais para apoiar a OSC com recursos permanentes.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    lgpdConsent: true,
  },
  {
    id: '4',
    name: 'Jefferson Silva',
    age: 19,
    role: 'participante',
    project: 'Inclusão Digital',
    quote: 'A Mensageiros abriu meus olhos para um mundo de tecnologia e trabalho corporativo que eu nem sabia que existia. Consegui meu primeiro emprego.',
    story: 'Jefferson vivia sem perspectivas profissionais ao terminar o ensino médio em escola pública. Inscreveu-se no curso de Informática Básica da Mensageiros da Esperança, onde obteve excelente rendimento. Orientado por nossa assistente social, participou de processos seletivos e hoje atua como Jovem Aprendiz da área operacional de uma grande seguradora em São Paulo.',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    lgpdConsent: true,
  }
];


export const transparencyDocs: TransparencyDoc[] = [
  {
    id: '1',
    title: 'Estatuto Social Consolidado da OSC',
    year: 2026,
    category: 'institucional',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1EstatutoSocialOSC2026/view?usp=sharing',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    publishDate: '10 Jan 2026'
  },
  {
    id: '2',
    title: 'Inscrição e Cadastro Ativo CNPJ',
    year: 2026,
    category: 'institucional',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1CNPJAtivoOSCMensageiros/view?usp=sharing',
    fileSize: '450 KB',
    fileType: 'PDF',
    publishDate: '11 Jan 2026'
  },
  {
    id: '3',
    title: 'Ata da Assembleia Geral Eleição Diretoria',
    year: 2026,
    category: 'governanca',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1AtaAssembleiaOSC2026/view?usp=sharing',
    fileSize: '2.3 MB',
    fileType: 'PDF',
    publishDate: '25 Fev 2026'
  },
  {
    id: '4',
    title: 'Regimento Interno e Normas de Conduta',
    year: 2025,
    category: 'governanca',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1RegimentoInternoOSC/view?usp=sharing',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    publishDate: '12 Ago 2025'
  },
  {
    id: '5',
    title: 'Relatório Anual de Atividades Sociais 2025',
    year: 2025,
    category: 'atividades',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1RelatorioAtividades2025/view?usp=sharing',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    publishDate: '15 Fev 2026'
  },
  {
    id: '6',
    title: 'Relatório Social de Impacto Comunitário 2024',
    year: 2024,
    category: 'atividades',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1RelatorioImpacto2024/view?usp=sharing',
    fileSize: '2.8 MB',
    fileType: 'PDF',
    publishDate: '20 Jan 2025'
  },
  {
    id: '7',
    title: 'Balanço Patrimonial e DRE Consolidada 2025',
    year: 2025,
    category: 'contas',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1BalancoPatrimonialDRE2025/view?usp=sharing',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    publishDate: '01 Mar 2026'
  },
  {
    id: '8',
    title: 'Auditoria Contábil e Demonstrações Financeiras 2024',
    year: 2024,
    category: 'contas',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1AuditoriaFinanceira2024/view?usp=sharing',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    publishDate: '12 Fev 2025'
  },
  {
    id: '9',
    title: 'Termo de Colaboração MROSC e Plano de Trabalho - Osasco',
    year: 2026,
    category: 'mrosc',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1TermoMROSCOsasco2026/view?usp=sharing',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    publishDate: '02 Jan 2026'
  },
  {
    id: '10',
    title: 'Relatório de Execução de Parceria Pública MROSC - Lapa',
    year: 2025,
    category: 'mrosc',
    status: 'atualizacao',
    fileUrl: 'https://drive.google.com/file/d/1RelatorioParceriaLapa2025/view?usp=sharing',
    fileSize: '0 KB',
    fileType: 'PDF',
    publishDate: 'Pendente'
  },
  {
    id: '11',
    title: 'Política de Proteção à Criança e Adolescente',
    year: 2026,
    category: 'politicas',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1PoliticaProtecaoMenores/view?usp=sharing',
    fileSize: '920 KB',
    fileType: 'PDF',
    publishDate: '03 Jan 2026'
  },
  {
    id: '12',
    title: 'Código de Ética e Integridade Institucional',
    year: 2025,
    category: 'politicas',
    status: 'disponivel',
    fileUrl: 'https://drive.google.com/file/d/1CodigoEticaOSCMensageiros/view?usp=sharing',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    publishDate: '15 Mar 2025'
  }
];

export const partners: Partner[] = [
  {
    id: '1',
    name: 'Instituto Inovação Sustentável',
    logoUrl: 'https://images.unsplash.com/photo-1599305090598-615254b23571?q=80&w=300&auto=format&fit=crop',
    category: 'financeiro',
    websiteUrl: 'https://instituto-inovacao-sustentavel.org'
  },
  {
    id: '2',
    name: 'Supermercado Progresso Local',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300&auto=format&fit=crop',
    category: 'apoio',
    websiteUrl: 'https://supermercadoprogresso.com.br'
  },
  {
    id: '3',
    name: 'Associação de Moradores do Bairro Esperança',
    logoUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=300&auto=format&fit=crop',
    category: 'parceiro',
    websiteUrl: 'https://ambesperanca.org'
  },
  {
    id: '4',
    name: 'Fundação Cláudia Diniz',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop',
    category: 'financeiro',
    websiteUrl: 'https://fundacaoclaudiadiniz.org'
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Lorraine Machado',
    role: 'Presidente e Diretora Executiva',
    mandate: 'Gestão 2024-2026',
    displayOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Especialista em Gestão Social do Terceiro Setor com 18 anos de ativismo em projetos de inclusão produtiva para mulheres na América Latina. Lidera a expansão estratégica e a governança ética da organização.',
    linkedinUrl: 'https://linkedin.com/in/lorraine-machado',
    email: 'lorraine@mensageirosdaesperanca.org',
  },
  {
    id: '2',
    name: 'Ana Paula Silveira',
    role: 'Vice-Presidente e Relações Institucionais',
    mandate: 'Gestão 2024-2026',
    displayOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: 'Pós-graduada em Políticas Públicas, atua no desenvolvimento de convênios, editais públicos e gestão de parcerias estratégicas corporativas.',
    linkedinUrl: 'https://linkedin.com/in/ana-paula-silveira',
    email: 'anapaula@mensageirosdaesperanca.org',
  },
  {
    id: '3',
    name: 'Marcos Oliveira',
    role: 'Diretor Financeiro e Administrativo',
    mandate: 'Gestão 2024-2026',
    displayOrder: 3,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Administrador de empresas e especialista em contabilidade do terceiro setor. Coordena o fluxo de caixa, contratos e os balanços auditados.',
    linkedinUrl: 'https://linkedin.com/in/marcos-oliveira',
    email: 'marcos@mensageirosdaesperanca.org',
  },
  {
    id: '4',
    name: 'Juliana Costa Martins',
    role: 'Conselheira Técnica e Assistente Social',
    mandate: 'Gestão 2024-2026',
    displayOrder: 4,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    bio: 'Bacharel em Serviço Social, coordena o acolhimento, triagem socioeconômica e cadastramento de famílias vulneráveis da comunidade.',
    email: 'juliana.social@mensageirosdaesperanca.org',
  },
  {
    id: '5',
    name: 'Ricardo Mendes Santana',
    role: 'Coordenador do Conselho de Voluntariado',
    mandate: 'Gestão 2024-2026',
    displayOrder: 5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    bio: 'Especialista em captação comunitária. Gerencia a triagem, onboarding e capacitação de voluntários em todas as unidades da OSC.',
    linkedinUrl: 'https://linkedin.com/in/ricardo-mendes-santana',
    email: 'ricardo@mensageirosdaesperanca.org',
  },
];

export const contactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    phone: '(11) 99876-5432',
    subject: 'Cursos',
    message: 'Olá! Gostaria de saber se há vagas disponíveis para o curso de Panificação em março. Tenho interesse em participar e moro próximo à Sede Lapa.',
    status: 'pendente',
    isAnonymous: false,
    receivedAt: '24 Ago 2026 — 09:14',
  },
  {
    id: 'msg-2',
    name: 'Anônimo',
    email: 'canal-escuta@sistema.interno',
    subject: 'Canal de Escuta',
    message: 'Gostaria de relatar uma situação de desconforto que presenciei durante uma das atividades. Prefiro não me identificar por ora, mas gostaria que fosse investigado com discrição.',
    status: 'pendente',
    isAnonymous: true,
    receivedAt: '23 Ago 2026 — 16:42',
  },
  {
    id: 'msg-3',
    name: 'Paulo Henrique Abreu',
    email: 'paulo.abreu@empresa.com.br',
    phone: '(11) 3344-5566',
    subject: 'Orçamento Buffet Social',
    message: 'Prezados, somos uma empresa de médio porte e gostaríamos de solicitar um orçamento para o serviço de buffet social do Doce Mensageiro para o nosso evento corporativo de confraternização em dezembro com aproximadamente 120 pessoas.',
    status: 'respondido',
    isAnonymous: false,
    receivedAt: '22 Ago 2026 — 11:05',
    resolvedAt: '22 Ago 2026 — 15:30',
  },
  {
    id: 'msg-4',
    name: 'Carla Menezes',
    email: 'carla@ongparceira.org',
    subject: 'Parcerias e Projetos',
    message: 'Somos uma OSC que atua na área de saúde mental e acreditamos que há uma excelente oportunidade de parceria complementar com a Mensageiros da Esperança. Gostaríamos de agendar uma reunião.',
    status: 'pendente',
    isAnonymous: false,
    receivedAt: '21 Ago 2026 — 08:53',
  },
];

export const adminProfiles: AdminProfile[] = [
  {
    id: 'usr-1',
    fullName: 'Administrador Geral',
    email: 'admin@mensageiros.org',
    role: 'admin',
    status: 'ativo',
    createdAt: '10 Jan 2026',
  },
  {
    id: 'usr-2',
    fullName: 'Ana Paula Silveira',
    email: 'anapaula@mensageirosdaesperanca.org',
    role: 'admin',
    status: 'ativo',
    createdAt: '12 Jan 2026',
  },
  {
    id: 'usr-3',
    fullName: 'Marcos Oliveira',
    email: 'marcos@mensageirosdaesperanca.org',
    role: 'editor',
    status: 'ativo',
    createdAt: '15 Fev 2026',
  },
  {
    id: 'usr-4',
    fullName: 'Juliana Costa',
    email: 'comunicacao@mensageirosdaesperanca.org',
    role: 'comunicacao',
    status: 'convidado',
    createdAt: '20 Fev 2026',
  },
];


