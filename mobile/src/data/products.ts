import { CatalogProduct, ProductCategory } from '@/shared/types';

export type ProductFilter = ProductCategory | 'all';

// NOTE: .avif files are NOT supported by React Native.
// Convert empadinha1.avif and boloBaunilha.avif to .jpg to add those products.

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── SALGADOS ──────────────────────────────────────────────────────────────
  {
    id: 'coxinha',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/coxinha1.jpg'),
    name: { pt: 'Coxinha', en: 'Chicken Croquette', de: 'Hähnchen Krokette' },
    description: {
      pt: 'Massa crocante recheada com frango desfiado temperado',
      en: 'Crispy dough filled with seasoned shredded chicken',
      de: 'Knuspriger Teig mit gewürztem Hähnchenfleisch',
    },
  },
  {
    id: 'risole',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/risole1.jpeg'),
    name: { pt: 'Risole', en: 'Savory Pastry', de: 'Herzhafte Teigtasche' },
    description: {
      pt: 'Massa frita recheada com camarão ou presunto e queijo',
      en: 'Fried pastry filled with shrimp or ham and cheese',
      de: 'Gebratene Teigtasche mit Garnelen oder Schinken',
    },
  },
  {
    id: 'bolinho_bacalhau',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/bolinhoDeBacalhau2.jpg'),
    name: {
      pt: 'Bolinho de Bacalhau',
      en: 'Codfish Fritter',
      de: 'Kabeljau Krokette',
    },
    description: {
      pt: 'Bolinhos crocantes de bacalhau com batata e temperos',
      en: 'Crispy codfish balls with potato and herbs',
      de: 'Knusprige Kabeljaukugeln mit Kartoffel und Kräutern',
    },
  },
  {
    id: 'bolinho_aipim',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/bolinho-aipim_gordelicias4.jpg'),
    name: {
      pt: 'Bolinho de Aipim',
      en: 'Cassava Fritter',
      de: 'Maniok Krokette',
    },
    description: {
      pt: 'Bolinhos de aipim recheados com carne moída temperada',
      en: 'Cassava fritters filled with seasoned ground beef',
      de: 'Maniok-Bällchen mit gewürztem Hackfleisch',
    },
  },
  {
    id: 'bolinha_queijo',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/bolinhaDeQueijo1.jpg'),
    name: { pt: 'Bolinha de Queijo', en: 'Cheese Ball', de: 'Käsebällchen' },
    description: {
      pt: 'Bolinhas crocantes de massa com recheio de queijo derretido',
      en: 'Crispy dough balls with melted cheese filling',
      de: 'Knusprige Teigbällchen mit geschmolzenem Käse',
    },
  },
  {
    id: 'pao_de_queijo',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/paoDeQueijo.jpg'),
    name: {
      pt: 'Pão de Queijo',
      en: 'Brazilian Cheese Bread',
      de: 'Brasilianisches Käsebrot',
    },
    description: {
      pt: 'Pão de queijo mineiro artesanal, assado fresco',
      en: 'Artisan Minas-style cheese bread, freshly baked',
      de: 'Handgemachtes Minas-Käsebrot, frisch gebacken',
    },
  },

  {
    id: 'empadinha',
    category: 'salgado',
    pricingType: 'salgado',
    image: require('../../assets/produtos/salgados/empadinha1.jpg'),
    name: { pt: 'Empadinha', en: 'Mini Savory Pie', de: 'Herzhafte Törtchen' },
    description: {
      pt: 'Empadinhas caseiras de frango ou palmito, massa amanteigada',
      en: 'Homemade mini pies with chicken or hearts of palm',
      de: 'Hausgemachte Mini-Pasteten mit Hähnchen oder Palmherzen',
    },
  },

  // ── COMBOS ────────────────────────────────────────────────────────────────
  {
    id: 'combo_salgado',
    category: 'combo',
    pricingType: 'combo',
    image: require('../../assets/produtos/combos/combo1.jpeg'),
    name: {
      pt: 'Combo Salgado Mix',
      en: 'Savory Mix Combo',
      de: 'Herzhaftes Mix-Combo',
    },
    description: {
      pt: 'Seleção variada de salgados artesanais: coxinha, risole, bolinho e mais',
      en: 'Varied selection of artisan savory snacks',
      de: 'Vielfältige Auswahl herzhafter Snacks',
    },
  },
  {
    id: 'combo_misto',
    category: 'combo',
    pricingType: 'combo',
    image: require('../../assets/produtos/doces/doceCombo.jpg'),
    name: { pt: 'Combo Misto', en: 'Mixed Combo', de: 'Gemischtes Combo' },
    description: {
      pt: 'Mistura de salgados e doces artesanais para festas e eventos',
      en: 'Mix of artisan savory snacks and sweets for parties',
      de: 'Mix aus herzhaften Snacks und Süßigkeiten',
    },
  },

  // ── DOCES ─────────────────────────────────────────────────────────────────
  {
    id: 'brigadeiro',
    category: 'doce',
    pricingType: 'doce',
    image: require('../../assets/produtos/doces/brigadeiro1.jpeg'),
    name: { pt: 'Brigadeiro', en: 'Chocolate Truffle', de: 'Schokoladenbonbon' },
    description: {
      pt: 'Brigadeiro artesanal de chocolate belga com granulado crocante',
      en: 'Artisan brigadeiro with Belgian chocolate and crunchy sprinkles',
      de: 'Handgemachtes Schokoladenbonbon mit belgischer Schokolade',
    },
  },
  {
    id: 'caixa_doces',
    category: 'doce',
    pricingType: 'doce',
    image: require('../../assets/produtos/doces/docesVariados.jpg'),
    name: { pt: 'Caixa de Doces', en: 'Sweet Box', de: 'Süßigkeiten-Box' },
    description: {
      pt: 'Variedade de doces brasileiros: brigadeiro, beijinho, cajuzinho e mais',
      en: 'Variety of Brazilian sweets: brigadeiro, beijinho, cajuzinho and more',
      de: 'Vielfalt brasilianischer Süßigkeiten',
    },
  },

  // ── BOLOS CASEIROS (preço fixo €25) ──────────────────────────────────────
  {
    id: 'bolo_cenoura',
    category: 'bolo',
    pricingType: 'bolo',
    image: require('../../assets/produtos/bolos/boloCenouraCaseiro.jpg'),
    name: { pt: 'Bolo de Cenoura', en: 'Carrot Cake', de: 'Karottenkuchen' },
    description: {
      pt: 'Bolo caseiro de cenoura com cobertura de chocolate',
      en: 'Homemade carrot cake with chocolate frosting',
      de: 'Hausgemachter Karottenkuchen mit Schokoladenglasur',
    },
  },
  {
    id: 'bolo_chocolate',
    category: 'bolo',
    pricingType: 'bolo',
    image: require('../../assets/produtos/bolos/boloChocolate.jpeg'),
    name: {
      pt: 'Bolo de Chocolate',
      en: 'Chocolate Cake',
      de: 'Schokoladenkuchen',
    },
    description: {
      pt: 'Bolo caseiro de chocolate intenso com recheio cremoso',
      en: 'Homemade rich chocolate cake with creamy filling',
      de: 'Hausgemachter Schokoladenkuchen mit cremiger Füllung',
    },
  },
  {
    id: 'bolo_baunilha',
    category: 'bolo',
    pricingType: 'bolo',
    image: require('../../assets/produtos/bolos/boloBaunilha.jpg'),
    name: { pt: 'Bolo de Baunilha', en: 'Vanilla Cake', de: 'Vanillekuchen' },
    description: {
      pt: 'Bolo de baunilha macio com cobertura cremosa',
      en: 'Soft vanilla cake with creamy frosting',
      de: 'Weicher Vanillekuchen mit cremiger Glasur',
    },
  },
  {
    id: 'bolo_cenoura_2',
    category: 'bolo',
    pricingType: 'bolo',
    image: require('../../assets/produtos/bolos/boloDeCenoura.jpeg'),
    name: {
      pt: 'Bolo de Cenoura com Calda',
      en: 'Carrot Cake with Syrup',
      de: 'Karottenkuchen mit Sirup',
    },
    description: {
      pt: 'Bolo de cenoura fofo com calda de chocolate por cima',
      en: 'Fluffy carrot cake with chocolate syrup on top',
      de: 'Luftiger Karottenkuchen mit Schokoladensirup',
    },
  },
  {
    id: 'bolo_ninho',
    category: 'bolo',
    pricingType: 'bolo',
    image: require('../../assets/produtos/bolos/boloNinho.jpg'),
    name: { pt: 'Bolo Ninho', en: 'Milk Powder Cake', de: 'Milchpulver-Kuchen' },
    description: {
      pt: 'Bolo de leite Ninho com recheio e cobertura cremosa',
      en: 'Ninho milk cake with creamy filling and frosting',
      de: 'Ninho-Milchkuchen mit cremiger Füllung',
    },
  },
];
