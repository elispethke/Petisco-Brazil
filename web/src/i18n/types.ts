export interface Dictionary {
  navigation: {
    menu: string[];
    admin: string;
  };

  hero: {
    badge: string;
    description: string;
    orderButton: string;
    menuButton: string;
  };

  sections: {
    salgados: string;
    bolos: string;
    doces: string;
    brasil: string;
    confeitaria: string;
    brigaderia: string;
    lifestyle: string;
    artesanal: string;
    gourmet: string;
    combos: string;
    brasilEmCadaMordida: string;
  };

  cta: {
    titleTop: string;
    titleBottom: string;
    description: string;
    button: string;
  };

  privacy: {
    text: string;
    button: string;
  };

  modal: {
    title: string;
    description: string;
    ios: string;
    android: string;
    soon: string;
  };

  footer: {
    copyright: string;
  };

  products: {
    salgados: string[];
    bolos: string[];

    docesCombos: {
      name: string;
      desc: string;
      type: string;
    }[];

    cidades: {
      name: string;
      img: string;
    }[];
  };
}