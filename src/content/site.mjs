export const assetBase = process.env.ASSET_BASE_URL || "https://crystal.com.co/static/store";

const image = (path) => `${assetBase}/images/${path}`;

export const shared = {
  logo: image("Logos/Logo-crystal-transparente.png"),
  socials: {
    Instagram: "https://www.instagram.com/crystals.a.s/",
    LinkedIn: "https://www.linkedin.com/company/crystal-s-a-s/",
    Facebook: "https://web.facebook.com/grupocrystalsas",
    Vimeo: "https://vimeo.com/user74044025"
  },
  stats: [
    { value: "6", es: "plantas manufactureras", en: "manufacturing plants" },
    { value: "3", es: "centros de distribución", en: "distribution centers" },
    { value: "+270", es: "tiendas", en: "stores" },
    { value: "11", es: "países de Latinoamérica", en: "Latin American countries" }
  ],
  media: {
    home: image("Home/BANNERHOME_GEF.jpg"),
    homeAlt: image("Home/BANNERHOME_PB.jpg"),
    company: image("quienesSomos/quienes-somos-3333.png"),
    purpose: image("quienesSomos/proposito-y-esencia-1111.jpg"),
    essence: image("quienesSomos/Nuestra_Esencia.jpeg"),
    yarn: image("Home/dotacion-y-proteccion.jpg"),
    fullPackage: image("Home/paquete_completo.jpg"),
    brands: image("Home/dotacion-y-proteccion-333.png"),
    social: image("compromisoSocial/Comprometidos_con_las_personas.jpg"),
    community: image("compromisoSocial/Nuestra_Comunidad.jpeg"),
    environment: image("compromisoAmbiental/Compromiso_con_el_medio_ambiente.png"),
    water: image("compromisoAmbiental/Agua.png"),
    climate: image("compromisoAmbiental/Cambio_Climatico1.png"),
    socks: image("paqueteCompleto/Calceteria.png"),
    garment: image("paqueteCompleto/Confeccion_1.png"),
    textile: image("paqueteCompleto/Textil_1_nueva.png"),
    video: `${assetBase}/images/videos/Crystal_sostenible_2021.mp4`
  }
};

const esPaths = { home: "/", company: "/compania/", purpose: "/proposito/", business: "/modelo-de-negocio/", sustainability: "/sostenibilidad/", contact: "/contacto/" };
const enPaths = { home: "/en/", company: "/en/company/", purpose: "/en/purpose/", business: "/en/business-model/", sustainability: "/en/sustainability/", contact: "/en/contact/" };

const spanishPages = {
  home: {
    metaTitle: "Crystal S.A.S. | Industria, moda y propósito desde 1938",
    metaDescription: "Crystal integra manufactura, marcas y moda consciente desde Colombia para Latinoamérica.",
    eyebrow: "Industria colombiana · 1938—2026", title: "Hacemos moda desde el origen.",
    intro: "Somos una compañía colombiana que conecta fibras, conocimiento industrial y marcas para ayudar a las personas a expresar su esencia.",
    heroAlt: "Campaña de moda de Crystal", index: "Una compañía / seis plantas / un sistema conectado",
    opening: "Casi nueve décadas entendiendo que una prenda comienza mucho antes de llegar a una tienda.",
    businessTitle: "Una cadena que piensa y produce como una sola.", businessIntro: "Nuestra integración vertical reúne hilandería, textiles, confección, calcetería, paquete completo y marcas propias.",
    purposeTitle: "Existir para ayudar a las personas a expresar su esencia a través de una moda consciente.",
    sustainabilityTitle: "El impacto también se diseña.", sustainabilityBody: "Las personas, el planeta y el desarrollo económico orientan nuestra ruta de sostenibilidad.",
    faqTitle: "Preguntas frecuentes",
    faqs: [["¿Qué es Crystal S.A.S.?", "Una compañía colombiana productora y comercializadora de vestuario y moda, con un modelo integrado de manufactura, paquete completo y marcas."], ["¿Qué marcas hacen parte de Crystal?", "Gef, Punto Blanco, Baby Fresh, Galax y Casino hacen parte del portafolio, además de la operación de la franquicia Parfois."], ["¿Dónde opera Crystal?", "Crystal cuenta con seis plantas manufactureras en Colombia, oficinas en cuatro países y presencia comercial en once países de Latinoamérica."], ["¿Cómo puedo contactar a Crystal?", "Puedes elegir el área correspondiente y enviar tu mensaje desde la página de contacto."]]
  },
  company: {
    metaTitle: "Compañía | Crystal S.A.S.", metaDescription: "Conoce la historia, presencia y gobierno corporativo de Crystal, compañía colombiana de moda fundada en 1938.",
    eyebrow: "Compañía", title: "Lo que empezó con un par de medias hoy conecta una industria.",
    intro: "Somos una compañía colombiana productora y comercializadora de marcas de vestuario y moda. Nuestros clientes y consumidores están en el centro de una estrategia basada en omnicanalidad y sostenibilidad.", heroAlt: "Historia y equipo humano de Crystal",
    historyTitle: "Una historia construida puntada a puntada.",
    history: [["1938", "Zigzag", "Tres emprendedores colombianos iniciaron una empresa dedicada a producir calcetines para niños."], ["1948", "Calcetería Victoria", "Después de Zigzag nació Calcetería Victoria, una nueva etapa para el proyecto industrial."], ["1950", "Fábrica Crystal", "La Fábrica de Calcetines Crystal abrió en el Barrio Antioquia de Medellín y sentó las bases de la compañía actual."], ["Hoy", "Sistema integrado", "Seis plantas, más de 270 tiendas y presencia en once países conectan industria, marcas y consumidores."]],
    footprintTitle: "Capacidad local, alcance latinoamericano.", footprintBody: "Operamos procesos de hilandería, tintorería, textiles, confección y calcetería, con oficinas en Colombia, Estados Unidos, México y Costa Rica.",
    governanceTitle: "Una estructura para decidir con responsabilidad.", governanceBody: "La Junta Directiva, nombrada por la Asamblea de Accionistas, fija la estrategia y supervisa el desempeño gerencial junto con las presidencias, vicepresidencias, revisoría fiscal y comités directivos.", governanceLink: "Conoce nuestras políticas"
  },
  purpose: {
    metaTitle: "Propósito y esencia | Crystal S.A.S.", metaDescription: "El propósito y los valores que orientan la forma de trabajar de Crystal S.A.S.",
    eyebrow: "Propósito y esencia", title: "La moda es una forma de decir quiénes somos.", statement: "Existir para ayudar a las personas a expresar su esencia a través de una moda consciente.",
    intro: "Nuestro propósito es una decisión cotidiana: crear con conciencia, relacionarnos con honestidad y convertir cada posibilidad en una acción que deje una huella positiva.", heroAlt: "Propósito y esencia de Crystal",
    valuesTitle: "Cinco maneras de vivir Crystal.", values: [["Posibilistas", "Vemos alternativas donde otros ven límites."], ["Optimismo", "Miramos el futuro con energía y confianza."], ["Constancia", "Sostenemos el esfuerzo que convierte ideas en resultados."], ["Sentido social", "Entendemos que crecer también es aportar."], ["Honestidad", "Actuamos con transparencia y coherencia."]],
    closing: "Nuestra esencia no es un manifiesto colgado en una pared. Es la forma en que trabajamos, decidimos y nos relacionamos."
  },
  business: {
    metaTitle: "Modelo de negocio | Crystal S.A.S.", metaDescription: "Conoce el modelo vertical de Crystal: hilandería, textiles, confección, calcetería, paquete completo y marcas.",
    eyebrow: "Modelo de negocio", title: "Del hilo a la experiencia de marca.", intro: "Una red de capacidades conectadas nos permite acompañar una idea desde la materia prima hasta el consumidor final.", processTitle: "Un sistema, cinco especialidades.",
    units: [
      { number: "01", title: "Hilandería", subtitle: "Colhilados · Rionegro", body: "Una alianza estratégica establecida en 2004. Produce hilados de algodón, poliéster, especialidades y mezclas.", facts: ["22 toneladas / día", "200.000 pies²", "Algodón certificado BCI"], image: shared.media.yarn },
      { number: "02", title: "Calcetería", subtitle: "Marinilla", body: "Tecnología italiana para calcetines casuales, formales, deportivos y de descanso para todas las edades.", facts: ["600.000 pies²", "Tecnología italiana", "Portafolio multisegmento"], image: shared.media.socks },
      { number: "03", title: "Textiles", subtitle: "Marinilla", body: "Tejido circular para jerseys, doble punto, piqué, rib, jacquards y fleece en fibras naturales, sintéticas y mezclas.", facts: ["1.000.000 pies²", "Tejido circular", "Naturales y mezclas"], image: shared.media.textile },
      { number: "04", title: "Confección", subtitle: "Manizales + Pereira", body: "Dos plantas especializadas en prendas interiores, lounge, deportivas y casuales.", facts: ["2 plantas", "168.500 pies²", "Producto terminado"], image: shared.media.garment },
      { number: "05", title: "Marcas", subtitle: "Latinoamérica", body: "Gef, Punto Blanco, Baby Fresh, Galax y Casino conectan la capacidad industrial con experiencias cercanas a las personas.", facts: ["+270 tiendas", "11 países", "Omnicanalidad"], image: shared.media.brands }
    ], closingTitle: "Paquete completo", closingBody: "Acompañamos marcas alrededor del mundo desde el desarrollo y abastecimiento hasta la manufactura y entrega de producto terminado."
  },
  sustainability: {
    metaTitle: "Sostenibilidad | Crystal S.A.S.", metaDescription: "Conoce los compromisos sociales, ambientales y económicos que orientan la ruta de sostenibilidad de Crystal.",
    eyebrow: "Sostenibilidad", title: "Producir mejor es cuidar lo que nos conecta.", intro: "Definimos tres pilares para avanzar hacia nuestro propósito: las personas y la comunidad, el planeta y la contribución al desarrollo económico.",
    pillars: [["01", "Social", "Bienestar, desarrollo y relaciones que fortalecen a colaboradores, familias y comunidades."], ["02", "Ambiental", "Uso responsable de recursos, acción climática y mejora continua en toda la cadena."], ["03", "Económico", "Empleo, industria y capacidades que aportan al desarrollo de los territorios."]],
    socialTitle: "Comprometidos con las personas.", socialBody: "Comprendemos al ser humano desde su integralidad. Trabajamos con nuestros colaboradores, sus familias y comunidades para promover el desarrollo individual, familiar y social.",
    environmentTitle: "En armonía con el entorno.", environmentBody: "Optimizamos el uso del agua y la energía, revisamos nuestros procesos y promovemos materias primas, empaques, procesos y tiendas con menor impacto.",
    reportsTitle: "Resultados que se pueden consultar.", reportsBody: "Los informes anuales reúnen iniciativas sociales, económicas y ambientales y las comparten con nuestros grupos de interés.", reports: ["2025", "2024", "2023", "2022", "2021"], certification: "En nuestras plantas consumimos energía generada por fuentes 100% renovables como parte del compromiso con la mitigación del cambio climático."
  },
  contact: {
    metaTitle: "Contacto | Crystal S.A.S.", metaDescription: "Comunícate con Crystal S.A.S. y dirige tu solicitud al área correspondiente.", eyebrow: "Contacto", title: "Estamos aquí para escucharte.", intro: "Déjanos tus comentarios, dudas o sugerencias y elige el área con la que deseas comunicarte.",
    areas: ["Hilandería", "Industria", "Paquete completo", "Ventas institucionales", "Gef", "Punto Blanco", "Baby Fresh", "Galax", "Parfois", "Servicio al cliente", "Ética", "Franquicias o distribuidores", "Proveedores y compras"],
    fields: { area: "Dirigido a", name: "Nombres", lastName: "Apellidos", email: "Correo electrónico", company: "Compañía / Empresa", message: "Mensaje", submit: "Enviar mensaje", sending: "Enviando…", success: "Recibimos tu mensaje. Te responderemos lo antes posible.", error: "No fue posible enviar el mensaje. Intenta nuevamente." },
    privacy: "Los datos personales serán tratados para atender y dar solución a tu solicitud. Puedes ejercer tus derechos escribiendo a proteccionbasedatos@crystal.com.co.", customerLine: "Línea de atención a clientes", phone: "01 8000 517 536"
  }
};

const englishPages = {
  home: {
    metaTitle: "Crystal S.A.S. | Industry, fashion and purpose since 1938", metaDescription: "Crystal connects manufacturing, brands and conscious fashion from Colombia to Latin America.",
    eyebrow: "Colombian industry · 1938—2026", title: "We make fashion from its source.", intro: "We are a Colombian company connecting fibers, industrial knowledge and brands to help people express their essence.", heroAlt: "Crystal fashion campaign", index: "One company / six plants / one connected system", opening: "Nearly nine decades understanding that a garment begins long before it reaches a store.",
    businessTitle: "A chain that thinks and produces as one.", businessIntro: "Our vertical integration brings together spinning, textiles, garment manufacturing, hosiery, full package and our own brands.", purposeTitle: "To exist to help people express their essence through conscious fashion.", sustainabilityTitle: "Impact is designed too.", sustainabilityBody: "People, the planet and economic development guide our sustainability journey.", faqTitle: "Frequently asked questions",
    faqs: [["What is Crystal S.A.S.?", "A Colombian apparel and fashion company with an integrated model spanning manufacturing, full-package services and brands."], ["Which brands are part of Crystal?", "Gef, Punto Blanco, Baby Fresh, Galax and Casino are part of the portfolio, alongside the Parfois franchise operation."], ["Where does Crystal operate?", "Crystal has six manufacturing plants in Colombia, offices in four countries and a commercial presence across eleven Latin American countries."], ["How can I contact Crystal?", "Choose the relevant area and send your message through the contact page."]]
  },
  company: {
    metaTitle: "Company | Crystal S.A.S.", metaDescription: "Discover the history, footprint and corporate governance of Crystal, a Colombian fashion company founded in 1938.", eyebrow: "Company", title: "What began with a pair of socks now connects an industry.", intro: "We are a Colombian apparel and fashion company. Customers and consumers are at the center of a strategy built on omnichannel experiences and sustainability.", heroAlt: "Crystal history and people", historyTitle: "A history built stitch by stitch.",
    history: [["1938", "Zigzag", "Three Colombian entrepreneurs started a company making children's socks."], ["1948", "Calcetería Victoria", "After Zigzag, Calcetería Victoria opened a new chapter for the industrial project."], ["1950", "Crystal factory", "The Crystal sock factory opened in Medellín and laid the foundations of today's company."], ["Today", "Integrated system", "Six plants, more than 270 stores and a presence in eleven countries connect industry, brands and consumers."]],
    footprintTitle: "Local capabilities, Latin American reach.", footprintBody: "We operate spinning, dyeing, textiles, garment and hosiery processes, with offices in Colombia, the United States, Mexico and Costa Rica.", governanceTitle: "A structure for responsible decisions.", governanceBody: "The Board of Directors sets strategy and oversees management alongside the corporate and executive presidencies, vice presidencies, statutory audit and management committees.", governanceLink: "Explore our policies"
  },
  purpose: {
    metaTitle: "Purpose and essence | Crystal S.A.S.", metaDescription: "The purpose and values that guide the way Crystal works.", eyebrow: "Purpose and essence", title: "Fashion is a way of saying who we are.", statement: "To exist to help people express their essence through conscious fashion.", intro: "Our purpose is a daily choice: to create consciously, build relationships honestly and turn possibility into action with a positive impact.", heroAlt: "Crystal purpose and essence", valuesTitle: "Five ways of living Crystal.", values: [["Possibilists", "We see alternatives where others see limits."], ["Optimism", "We look to the future with energy and confidence."], ["Perseverance", "We sustain the effort that turns ideas into results."], ["Social awareness", "We understand that growing also means contributing."], ["Honesty", "We act transparently and consistently."]], closing: "Our essence is not a manifesto on a wall. It is how we work, decide and relate to one another."
  },
  business: {
    metaTitle: "Business model | Crystal S.A.S.", metaDescription: "Discover Crystal's vertical model: spinning, textiles, garment manufacturing, hosiery, full package and brands.", eyebrow: "Business model", title: "From yarn to the brand experience.", intro: "A network of connected capabilities lets us support an idea from raw material to the final consumer.", processTitle: "One system, five specialties.",
    units: [
      { number: "01", title: "Spinning", subtitle: "Colhilados · Rionegro", body: "A strategic alliance established in 2004, producing cotton, polyester, specialty and blended yarns.", facts: ["22 tonnes / day", "200,000 ft²", "BCI-certified cotton"], image: shared.media.yarn },
      { number: "02", title: "Hosiery", subtitle: "Marinilla", body: "Italian technology for casual, formal, sport and comfort socks for every age.", facts: ["600,000 ft²", "Italian technology", "Multi-segment portfolio"], image: shared.media.socks },
      { number: "03", title: "Textiles", subtitle: "Marinilla", body: "Circular knitting for jerseys, double knits, piqué, rib, jacquards and fleece in natural, synthetic and blended fibers.", facts: ["1,000,000 ft²", "Circular knitting", "Natural and blended fibers"], image: shared.media.textile },
      { number: "04", title: "Garment manufacturing", subtitle: "Manizales + Pereira", body: "Two plants specializing in underwear, lounge, sportswear and casual garments.", facts: ["2 plants", "168,500 ft²", "Finished product"], image: shared.media.garment },
      { number: "05", title: "Brands", subtitle: "Latin America", body: "Gef, Punto Blanco, Baby Fresh, Galax and Casino connect industrial capability with experiences close to people.", facts: ["270+ stores", "11 countries", "Omnichannel"], image: shared.media.brands }
    ], closingTitle: "Full package", closingBody: "We support brands around the world from development and sourcing through manufacturing and finished-product delivery."
  },
  sustainability: {
    metaTitle: "Sustainability | Crystal S.A.S.", metaDescription: "Discover the social, environmental and economic commitments guiding Crystal's sustainability journey.", eyebrow: "Sustainability", title: "Producing better means caring for what connects us.", intro: "We defined three pillars to advance our purpose: people and communities, the planet and our contribution to economic development.", pillars: [["01", "Social", "Well-being, development and relationships that strengthen employees, families and communities."], ["02", "Environmental", "Responsible resource use, climate action and continuous improvement throughout the chain."], ["03", "Economic", "Employment, industry and capabilities that contribute to regional development."]], socialTitle: "Committed to people.", socialBody: "We understand people as a whole. We work with employees, families and communities to promote individual, family and social development.", environmentTitle: "In harmony with our surroundings.", environmentBody: "We optimize water and energy use, review our processes and promote lower-impact materials, packaging, operations and stores.", reportsTitle: "Results you can review.", reportsBody: "Annual reports bring together social, economic and environmental initiatives and share them with our stakeholders.", reports: ["2025", "2024", "2023", "2022", "2021"], certification: "Our plants use electricity generated from 100% renewable sources as part of our climate-change mitigation commitment."
  },
  contact: {
    metaTitle: "Contact | Crystal S.A.S.", metaDescription: "Contact Crystal S.A.S. and direct your request to the appropriate team.", eyebrow: "Contact", title: "We are here to listen.", intro: "Leave us your comments, questions or suggestions and choose the team you would like to reach.", areas: ["Spinning", "Industry", "Full package", "Institutional sales", "Gef", "Punto Blanco", "Baby Fresh", "Galax", "Parfois", "Customer service", "Ethics", "Franchises or distributors", "Suppliers and purchasing"], fields: { area: "Send to", name: "First name", lastName: "Last name", email: "Email", company: "Company", message: "Message", submit: "Send message", sending: "Sending…", success: "We received your message and will reply as soon as possible.", error: "We could not send your message. Please try again." }, privacy: "Personal data will be processed to handle your request. You can exercise your rights by writing to proteccionbasedatos@crystal.com.co.", customerLine: "Customer service line", phone: "01 8000 517 536"
  }
};

export const locales = {
  es: { id: "es", code: "es-CO", languageLabel: "EN", skip: "Saltar al contenido", menu: "Menú", close: "Cerrar", paths: esPaths, alternatePaths: enPaths, nav: { company: "Compañía", purpose: "Propósito", business: "Modelo de negocio", sustainability: "Sostenibilidad", contact: "Contacto" }, common: { explore: "Explorar", discover: "Conocer más", back: "Volver al inicio", scroll: "Desliza", since: "Desde 1938", read: "Leer", download: "Descargar", next: "Siguiente" }, footer: { statement: "Moda consciente. Industria conectada. Personas que dejan huella.", info: "Información", governance: "Gobierno corporativo", policies: "Políticas", reports: "Informes de sostenibilidad", privacy: "Protección de datos", rights: "Todos los derechos reservados." }, pages: spanishPages },
  en: { id: "en", code: "en", languageLabel: "ES", skip: "Skip to content", menu: "Menu", close: "Close", paths: enPaths, alternatePaths: esPaths, nav: { company: "Company", purpose: "Purpose", business: "Business model", sustainability: "Sustainability", contact: "Contact" }, common: { explore: "Explore", discover: "Discover more", back: "Back home", scroll: "Scroll", since: "Since 1938", read: "Read", download: "Download", next: "Next" }, footer: { statement: "Conscious fashion. Connected industry. People who leave a mark.", info: "Information", governance: "Corporate governance", policies: "Policies", reports: "Sustainability reports", privacy: "Data protection", rights: "All rights reserved." }, pages: englishPages }
};
