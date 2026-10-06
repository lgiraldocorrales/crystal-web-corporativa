export const assetBase = process.env.ASSET_BASE_URL || "https://crystal.com.co/static/store";

export const shared = {
  socials: {
    instagram: "https://www.instagram.com/crystals.a.s/",
    linkedin: "https://www.linkedin.com/company/crystal-s-a-s/",
    facebook: "https://web.facebook.com/grupocrystalsas",
    vimeo: "https://vimeo.com/user74044025"
  },
  stats: [
    { value: "6", es: "plantas manufactureras", en: "manufacturing plants" },
    { value: "3", es: "centros de distribución", en: "distribution centers" },
    { value: "+270", es: "tiendas", en: "stores" },
    { value: "11", es: "países de Latinoamérica", en: "Latin American countries" }
  ]
};

export const locales = {
  es: {
    code: "es-CO",
    path: "/",
    alternate: "/en/",
    languageLabel: "EN",
    skip: "Saltar al contenido",
    nav: {
      company: "Compañía",
      purpose: "Propósito",
      business: "Modelo de negocio",
      sustainability: "Sostenibilidad",
      contact: "Contacto"
    },
    meta: {
      title: "Crystal S.A.S. | Moda consciente e industria colombiana",
      description: "Crystal es una compañía colombiana de vestuario y moda con cerca de 90 años de trayectoria, seis plantas manufactureras y presencia en Latinoamérica."
    },
    hero: {
      eyebrow: "Compañía colombiana · Desde 1938",
      title: "Creamos moda que expresa la esencia de las personas.",
      body: "Integramos diseño, manufactura y marcas para construir una industria de moda consciente, competitiva y profundamente humana.",
      primary: "Conoce Crystal",
      secondary: "Explora nuestro modelo"
    },
    purpose: {
      eyebrow: "Nuestro propósito",
      title: "Existir para ayudar a las personas a expresar su esencia a través de una moda consciente.",
      link: "Descubre nuestra esencia"
    },
    business: {
      eyebrow: "Integración vertical",
      title: "Del hilo a las marcas: un sistema conectado.",
      intro: "Nuestra experiencia vive en cada etapa. Unimos conocimiento industrial, capacidad productiva y sensibilidad por las personas para llevar ideas al mercado.",
      items: [
        {
          number: "01",
          title: "Hilandería",
          body: "Transformamos fibras en hilos con procesos de alto desempeño que conectan calidad, innovación y eficiencia.",
          href: "/hilanderia/",
          image: `${assetBase}/images/Home/dotacion-y-proteccion.jpg`
        },
        {
          number: "02",
          title: "Paquete completo",
          body: "Acompañamos marcas alrededor del mundo desde el desarrollo hasta la entrega de producto terminado.",
          href: "/paquete/",
          image: `${assetBase}/images/Home/paquete_completo.jpg`
        },
        {
          number: "03",
          title: "Marcas",
          body: "Construimos experiencias de moda cercanas a las personas a través de Gef, Punto Blanco, Baby Fresh, Galax y Casino.",
          href: "/marcas/",
          image: `${assetBase}/images/Home/dotacion-y-proteccion-333.png`
        }
      ]
    },
    footprint: {
      eyebrow: "Presencia",
      title: "Capacidad local, alcance latinoamericano.",
      body: "Operamos un sistema vertical de hilandería, tintorería, textiles, confección y calcetería, con oficinas en Colombia, Estados Unidos, México y Costa Rica.",
      link: "Ver ubicaciones"
    },
    sustainability: {
      eyebrow: "Sostenibilidad",
      title: "Trabajar en armonía con nuestro entorno es parte del negocio.",
      body: "Asumimos la gestión social y ambiental como una prioridad. La moda consciente se construye con decisiones medibles, relaciones duraderas y una mirada responsable sobre cada proceso.",
      link: "Conoce nuestro compromiso"
    },
    ethics: {
      eyebrow: "Así somos",
      title: "Las acciones son la evidencia de nuestros valores.",
      body: "Constancia, honestidad, optimismo, posibilismo y sentido social orientan nuestra forma de construir empresa.",
      link: "Conoce el programa ético"
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Conoce más sobre Crystal",
      items: [
        { q: "¿Qué es Crystal S.A.S.?", a: "Crystal es una compañía colombiana productora y comercializadora de marcas de vestuario y moda, con un modelo integrado de manufactura, paquete completo y marcas." },
        { q: "¿Qué marcas hacen parte de Crystal?", a: "Crystal desarrolla y comercializa marcas como Gef, Punto Blanco, Baby Fresh, Galax y Casino, además de operar la franquicia Parfois." },
        { q: "¿Dónde tiene presencia Crystal?", a: "Crystal cuenta con operación manufacturera en Colombia, oficinas en varios países y presencia comercial en once países de Latinoamérica." },
        { q: "¿Cómo puedo contactar a Crystal?", a: "Puedes utilizar el formulario de contacto o consultar las líneas y correos disponibles en la sección de Servicio al Cliente." }
      ]
    },
    footer: {
      statement: "Moda consciente. Industria conectada. Personas que dejan huella.",
      company: "Compañía",
      resources: "Información",
      rights: "Todos los derechos reservados."
    }
  },
  en: {
    code: "en",
    path: "/en/",
    alternate: "/",
    languageLabel: "ES",
    skip: "Skip to content",
    nav: {
      company: "Company",
      purpose: "Purpose",
      business: "Business model",
      sustainability: "Sustainability",
      contact: "Contact"
    },
    meta: {
      title: "Crystal S.A.S. | Conscious fashion and Colombian industry",
      description: "Crystal is a Colombian apparel and fashion company with nearly 90 years of experience, six manufacturing plants and a presence across Latin America."
    },
    hero: {
      eyebrow: "Colombian company · Since 1938",
      title: "We create fashion that expresses people's essence.",
      body: "We bring together design, manufacturing and brands to build a conscious, competitive and deeply human fashion industry.",
      primary: "Discover Crystal",
      secondary: "Explore our model"
    },
    purpose: {
      eyebrow: "Our purpose",
      title: "To exist to help people express their essence through conscious fashion.",
      link: "Discover our essence"
    },
    business: {
      eyebrow: "Vertical integration",
      title: "From yarn to brands: one connected system.",
      intro: "Our experience lives in every stage. We connect industrial knowledge, production capabilities and human sensitivity to bring ideas to market.",
      items: [
        {
          number: "01",
          title: "Spinning",
          body: "We transform fibers into yarns through high-performance processes that connect quality, innovation and efficiency.",
          href: "/Spinning/",
          image: `${assetBase}/images/Home/dotacion-y-proteccion.jpg`
        },
        {
          number: "02",
          title: "Full package",
          body: "We support brands around the world from product development through finished-product delivery.",
          href: "/FullPackage/",
          image: `${assetBase}/images/Home/paquete_completo.jpg`
        },
        {
          number: "03",
          title: "Brands",
          body: "We create fashion experiences close to people through Gef, Punto Blanco, Baby Fresh, Galax and Casino.",
          href: "/en/#brands",
          image: `${assetBase}/images/Home/dotacion-y-proteccion-333.png`
        }
      ]
    },
    footprint: {
      eyebrow: "Our footprint",
      title: "Local capabilities, Latin American reach.",
      body: "We operate a vertical system spanning spinning, dyeing, textiles, garment manufacturing and hosiery, with offices in Colombia, the United States, Mexico and Costa Rica.",
      link: "View locations"
    },
    sustainability: {
      eyebrow: "Sustainability",
      title: "Working in harmony with our surroundings is part of our business.",
      body: "We treat social and environmental management as a priority. Conscious fashion is built through measurable decisions, lasting relationships and responsibility in every process.",
      link: "Discover our commitment"
    },
    ethics: {
      eyebrow: "This is who we are",
      title: "Actions are the evidence of our values.",
      body: "Perseverance, honesty, optimism, possibility and social awareness guide the way we build our company.",
      link: "Discover our ethics program"
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Learn more about Crystal",
      items: [
        { q: "What is Crystal S.A.S.?", a: "Crystal is a Colombian apparel and fashion company with an integrated business model spanning manufacturing, full-package services and brands." },
        { q: "Which brands are part of Crystal?", a: "Crystal develops and markets brands such as Gef, Punto Blanco, Baby Fresh, Galax and Casino, and operates the Parfois franchise." },
        { q: "Where does Crystal operate?", a: "Crystal has manufacturing operations in Colombia, offices in several countries and a commercial presence across eleven Latin American countries." },
        { q: "How can I contact Crystal?", a: "You can use the contact form or find available phone numbers and email addresses in the Customer Service section." }
      ]
    },
    footer: {
      statement: "Conscious fashion. Connected industry. People who leave a mark.",
      company: "Company",
      resources: "Information",
      rights: "All rights reserved."
    }
  }
};

export const media = {
  hero: [
    { src: `${assetBase}/images/Home/BANNERHOME_GEF.jpg`, altEs: "Campaña de moda Gef", altEn: "Gef fashion campaign" },
    { src: `${assetBase}/images/Home/BANNERHOME_PB.jpg`, altEs: "Campaña de moda Punto Blanco", altEn: "Punto Blanco fashion campaign" },
    { src: `${assetBase}/images/Home/BANNERHOME_BF.jpg`, altEs: "Campaña de moda Baby Fresh", altEn: "Baby Fresh fashion campaign" },
    { src: `${assetBase}/images/Home/BANNERHOME_GALAX.jpg`, altEs: "Campaña de moda Galax", altEn: "Galax fashion campaign" }
  ],
  purpose: [
    `${assetBase}/images/Home/proposito-y-esencia-inicio.jpeg`,
    `${assetBase}/images/Home/Nuestra_Esencia-inicio.jpeg`
  ],
  sustainabilityVideo: `${assetBase}/images/videos/Crystal_sostenible_2021.mp4`,
  logo: `${assetBase}/images/Logos/Logo-crystal-transparente.png`
};
