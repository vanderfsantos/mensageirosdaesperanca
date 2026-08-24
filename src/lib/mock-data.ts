import { CourseEvent, NewsPost, ImpactStory, TransparencyDoc, Partner, TeamMember } from '../types';

export const courseEvents: CourseEvent[] = [
  {
    id: '1',
    slug: 'informatica-basica',
    title: 'Informática Básica e Inclusão Digital',
    description: 'Curso focado em capacitar jovens e adultos da comunidade no uso de computadores, internet, ferramentas de escritório (Word, Excel) e introdução à navegação segura, abrindo portas para o mercado de trabalho.',
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
    title: 'Mensageiros da Esperança inaugura nova Sala de Informática',
    excerpt: 'Com a parceria estratégica do Instituto Inovação Sustentável, a comunidade agora conta com 15 computadores modernos e internet banda larga de alta velocidade.',
    content: 'Temos o orgulho de anunciar a inauguração da nossa nova Sala de Inclusão Digital. Esse espaço foi projetado para oferecer acesso gratuito à internet, capacitação tecnológica e mentorias profissionais para jovens e adultos do bairro. O projeto foi viabilizado através do aporte do Instituto Inovação Sustentável e doações da comunidade civil. Os novos computadores permitirão triplicar o número de alunos atendidos anualmente em nossos cursos livres e preparatórios.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    category: 'Conquistas',
    date: '20 Fev 2026',
    author: 'Juliana Costa',
    readTime: '3 min de leitura'
  },
  {
    id: '2',
    title: 'Campanha de Agasalho 2026 atende mais de 180 famílias',
    excerpt: 'Graças ao engajamento de nossos voluntários e doadores, conseguimos arrecadar mais de 600 cobertores e agasalhos na primeira fase da campanha.',
    content: 'O inverno se aproxima e a solidariedade aquece vidas. A primeira fase da Campanha de Agasalho 2026 foi um sucesso absoluto. Foram arrecadados e distribuídos agasados infantis, mantas e cobertores de alta qualidade para 185 famílias cadastradas em nossos programas de assistência social direta. Agradecemos a todos que doaram nos pontos de coleta parceiros. A campanha continua ativa e novas distribuições ocorrerão nas próximas semanas.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    category: 'Campanhas',
    date: '15 Fev 2026',
    author: 'Marcos Oliveira',
    readTime: '4 min de leitura'
  },
  {
    id: '3',
    title: 'Como o esporte tem transformado a vida de crianças na comunidade',
    excerpt: 'Projeto de futebol e artes marciais reduz a evasão escolar e promove integração social e saúde no contraturno escolar.',
    content: 'Nosso projeto esportivo "Mover a Vida" completa dois anos com dados impressionantes: 95% dos participantes frequentes apresentaram melhoria em suas notas escolares e frequência de aulas. Além do desenvolvimento físico e motor, os jovens aprendem lições valiosas de disciplina, respeito mútuo e trabalho em equipe. Conheça as histórias das nossas crianças e saiba como contribuir com equipamentos esportivos ou apadrinhando um atleta juvenil.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    category: 'Projetos',
    date: '02 Fev 2026',
    author: 'Ricardo Mendes',
    readTime: '5 min de leitura'
  }
];

export const impactStories: ImpactStory[] = [
  {
    id: '1',
    name: 'Maria do Socorro Souza',
    age: 42,
    role: 'empreendedor',
    story: 'Após perder o emprego formal na pandemia, Maria encontrou dificuldades para reingressar no mercado devido à idade e falta de qualificação específica. Ao participar do curso de Panificação Comunitária da Mensageiros da Esperança, ela não apenas aprendeu uma profissão, mas também recebeu suporte empreendedor. Hoje ela produz e comercializa pães artesanais sob encomenda, sustentando sua casa de forma independente.',
    quote: 'A Mensageiros da Esperança me deu mais do que uma receita de pão; eles me devolveram a dignidade de poder colocar comida na mesa com o meu próprio suor.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    project: 'Panificação Comunitária'
  },
  {
    id: '2',
    name: 'Carlos Eduardo Lima',
    age: 21,
    role: 'voluntario',
    story: 'Carlos entrou na organização como aluno do curso de informática básica. Demonstrando grande aptidão técnica e dedicação para ajudar os colegas mais velhos, ele foi convidado a se tornar monitor voluntário do projeto. A experiência prática no ensino de tecnologias inspirou Carlos a ingressar na faculdade de Análise e Desenvolvimento de Sistemas. Atualmente, ele concilia o voluntariado com o estágio em uma multinacional de software.',
    quote: 'Comecei querendo aprender a usar o Word e hoje crio sistemas reais. Fazer parte da equipe de voluntários foi o que transformou meu destino profissional.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    project: 'Inclusão Digital'
  },
  {
    id: '3',
    name: 'Helena Pires Camargo',
    age: 58,
    role: 'parceiro',
    story: 'Moradora vizinha da sede, dona Helena começou ajudando a organizar as prateleiras de doações no bazar beneficente. Impressionada com a lisura operacional e o impacto nítido nas crianças do bairro, ela decidiu formalizar doações financeiras mensais e mobilizou sua rede de contatos profissionais para apoiar a OSC com recursos permanentes.',
    quote: 'Apoiar o trabalho da Mensageiros é ver a solidariedade acontecer a poucos metros da minha janela. Cada centavo investido gera transformações reais no olhar das nossas crianças.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    project: 'Bazar Beneficente'
  },
  {
    id: '4',
    name: 'Jefferson Silva',
    age: 19,
    role: 'participante',
    story: 'Jefferson vivia sem perspectivas profissionais ao terminar o ensino médio em escola pública. Inscreveu-se no curso de Informática Básica da Mensageiros da Esperança, onde obteve excelente rendimento. Orientado por nossa assistente social, participou de processos seletivos e hoje atua como Jovem Aprendiz da área operacional de uma grande seguradora em São Paulo.',
    quote: 'A Mensageiros abriu meus olhos para um mundo de tecnologia e trabalho corporativo que eu nem sabia que existia. Consegui meu primeiro emprego.',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    project: 'Inclusão Digital'
  }
];

export const transparencyDocs: TransparencyDoc[] = [
  {
    id: '1',
    title: 'Relatório Anual de Atividades e Impacto Social 2025',
    year: 2025,
    category: 'relatorio',
    fileUrl: '/docs/relatorio-impacto-2025.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    publishDate: '10 Jan 2026'
  },
  {
    id: '2',
    title: 'Demonstrativo Financeiro Consolidado Exercício 2025',
    year: 2025,
    category: 'financeiro',
    fileUrl: '/docs/balanco-financeiro-2025.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    publishDate: '20 Jan 2026'
  },
  {
    id: '3',
    title: 'Edital 01/2026 - Seleção Pública de Projetos e Oficinas Sociais',
    year: 2026,
    category: 'edital',
    fileUrl: '/docs/edital-oficinas-2026.pdf',
    fileSize: '950 KB',
    fileType: 'PDF',
    publishDate: '05 Fev 2026'
  },
  {
    id: '4',
    title: 'Ata de Eleição da Diretoria Executiva e Conselho Fiscal',
    year: 2026,
    category: 'ata',
    fileUrl: '/docs/ata-eleicao-diretoria-2026.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    publishDate: '12 Fev 2026'
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
    name: 'Ana Paula Silveira',
    role: 'Diretora Executiva',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: 'Profissional com mais de 15 anos de atuação no Terceiro Setor, pós-graduada em Gestão de Políticas Públicas e Desenvolvimento Social.',
    linkedinUrl: 'https://linkedin.com/in/ana-paula-silveira',
    email: 'anapaula@mensageirosdaesperanca.org'
  },
  {
    id: '2',
    name: 'Marcos Oliveira',
    role: 'Coordenador Geral de Projetos',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Educador físico e ativista comunitário, responsável por gerenciar o cronograma de oficinas esportivas, culturais e profissionalizantes.',
    linkedinUrl: 'https://linkedin.com/in/marcos-oliveira',
    email: 'marcos@mensageirosdaesperanca.org'
  },
  {
    id: '3',
    name: 'Juliana Costa Martins',
    role: 'Assistente Social Corporativa',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    bio: 'Bacharel em Serviço Social, cuida do cadastramento, triagem e acolhimento das famílias de alta vulnerabilidade beneficiadas pelos nossos programas.',
    email: 'juliana.social@mensageirosdaesperanca.org'
  },
  {
    id: '4',
    name: 'Ricardo Mendes Santana',
    role: 'Coordenador de Voluntários',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    bio: 'Especialista em engajamento corporativo e comunitário, gerencia a recepção, capacitação e alocação de novos voluntários nos eventos da OSC.',
    linkedinUrl: 'https://linkedin.com/in/ricardo-mendes-santana',
    email: 'ricardo@mensageirosdaesperanca.org'
  }
];
