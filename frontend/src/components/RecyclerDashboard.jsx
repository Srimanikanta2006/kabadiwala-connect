import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getRecentOfflineLots } from '../db/offlineDb';
import Form6ManifestModal from './recycler/Form6ManifestModal';
import AdminToolsModal from './common/AdminToolsModal';
import NotificationsModal from './common/NotificationsModal';
import { API_BASE } from '../services/apiConfig';

const INITIAL_FACILITIES = [
  {
    id: 'rec_ecorecycle_01',
    name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1042',
    location: 'Andheri East / Mumbai MMR',
    materials: ['PCB', 'Cables', 'Batteries', 'Displays', 'Appliances'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_greencircle_02',
    name: 'GreenCircle Urban Recyclers',
    reg_no: 'CPCB/E-WASTE/REG/MH/2022/0891',
    location: 'Dharavi Link Road / Mumbai',
    materials: ['PCB', 'Cables', 'Batteries'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_cerebra_03',
    name: 'Cerebra Integrated Technologies Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2021/0432',
    location: 'TTC Industrial Area / Navi Mumbai',
    materials: ['PCB', 'Displays', 'Appliances'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_greenscape_04',
    name: 'Greenscape Eco Management Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1187',
    location: 'Taloja MIDC / Navi Mumbai',
    materials: ['Batteries', 'Motors', 'Plastics'],
    tier: 'Tier-2'
  },
  {
    id: 'rec_envirocare_05',
    name: 'Enviro-Care Recycling Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2020/0219',
    location: 'Bhosari MIDC / Pune',
    materials: ['PCB', 'Cables', 'Displays'],
    tier: 'Tier-1'
  }
];

const RECYCLER_TRANSLATIONS = {
  hi: {
    brandSub: 'रीसायकलर',
    online: 'ऑनलाइन',
    authorizedFacility: 'अधिकृत संयंत्र',
    selectFacility: 'संयंत्र चुनें',
    plantOps: 'प्लांट ऑपरेशंस',
    weighbridgeAdmin: 'धर्मकांटा प्रबंधक',
    adminTools: 'एडमिन टूल्स',
    notifications: 'सूचनाएं',
    signOut: 'साइन आउट / रोल बदलें',
    authorizedRecyclerDesk: 'अधिकृत रीसायकलर डेस्क',
    location: 'स्थान:',
    scaleStatus: 'कांटा स्थिति:',
    digitalCertified: 'डिजिटल प्रमाणित (±0.02 किग्रा)',
    monthlyQuota: 'मासिक कोटा',
    target: 'लक्ष्य:',
    
    // Tabs
    tabIncomingLots: 'आवक लॉट्स',
    tabActivePickups: 'सक्रिय पिकअप',
    tabMaterialInventory: 'सामग्री इन्वेंटरी',
    tabPriceQuotes: 'खरीद दर एवं कोट्स',
    tabTraceabilityEpr: 'ट्रेसेबिलिटी एवं CPCB',
    tabFacilitySettings: 'संयंत्र सेटिंग्स',
    
    // Top Overview Metrics Strip
    metricIncomingLots: 'आवक लॉट्स',
    active: 'सक्रिय',
    urgentWithin10km: '५ आवश्यक < १० किमी',
    activeClusters: 'सक्रिय क्लस्टर्स',
    pendingQuotes: 'लंबित कोट्स',
    inBidding: 'बोली प्रगति पर',
    avgResponse12m: 'औसत समय: १२ मि',
    negotiationOpen: 'सौदा चालू',
    todaysSettlements: 'आज का भुगतान',
    instant: 'तुरंत',
    directToAggregators: 'कबाड़ियों को सीधे भुगतान',
    zeroCommission: 'शून्य कमीशन',
    verifiedTonnage: 'सत्यापित कुल वजन',
    facilityQuota: 'संयंत्र कोटा',
    
    // Confirmation Banner
    weighbridgeConfirmedTitle: 'धर्मकांटा तौल पुष्ट • CPCB प्रमाण पत्र जारी',
    viewForm6Manifest: 'फॉर्म-६ मेनिफेस्ट देखें',
    dismiss: 'हटाएं',
    
    // Filters & Inbound Lots
    categoryFilterLabel: 'श्रेणी:',
    all: 'सभी',
    allLotsWithCount: (cnt) => `सभी लॉट (${cnt})`,
    circuitBoards: 'सर्किट बोर्ड',
    copperCables: 'तांबे की केबल',
    pcb: 'पीसीबी',
    cables: 'केबल्स',
    batteries: 'बैटरियां',
    displays: 'डिस्प्ले',
    appliances: 'उपकरण',
    distance: 'दूरी:',
    allDistances: 'पूरा क्षेत्र',
    within5km: '५ किमी के दायरे में',
    within10km: '१० किमी के दायरे में',
    within25km: '२५ किमी के दायरे में',
    noLotsFound: 'फ़िल्टर से मेल खाता कोई लॉट नहीं मिला',
    resetFilters: 'फ़िल्टर रीसेट करें',
    dealerPallet: 'डीलर पैलेट',
    certifiedInbound: 'प्रमाणित आवक',
    verifiedGrossWeight: 'सत्यापित सकल वजन',
    netWeight: 'शुद्ध वजन',
    collectorAsking: 'कलेक्टर मांग',
    marketRange: 'बाजार भाव',
    aiPurity: 'AI शुद्धता',
    sourceOrigin: 'स्रोत उद्गम',
    aggregatorYard: 'यार्ड संग्रह',
    doorstepCollector: 'घर-घर कबाड़ी',
    fulfillmentMode: 'खरीद दर कोट करें:',
    vanPickup: 'वैन पिकअप',
    selfDropoff: 'स्वयं ड्रॉपऑफ',
    totalValue: 'कुल मूल्य:',
    dispatchFleet: 'गाड़ी भेजें',
    counterOffer: 'काउंटर ऑफर',
    offerSent: 'ऑफर भेजी गई',
    viewCpcbCert: 'CPCB प्रमाण पत्र देखें',
    acceptAndWeighbridge: 'स्वीकारें व धर्मकांटा',
    quoteProcurementRate: 'खरीद भाव कोट करें',
    quotedRate: 'कोट किया भाव',
    confirmWeighbridgeAccept: 'कांटा वजन सत्यापित करें एवं स्वीकारें',
    issueForm6Manifest: 'फॉर्म-६ जारी करें',
    digitalLogReady: 'डिजिटल लॉग तैयार',
    cpcbCode: 'CPCB कोड:',
    scaleCalibrated: 'कांटा प्रमाणित',
    eprVerificationStandard: 'EPR सत्यापन मानक',
    
    // Right Column Logistics & Audit
    todaysDispatchLine: 'आज की प्रेषण कतार',
    scheduledCount: '८ निर्धारित',
    driver: 'चालक:',
    destination: 'गंतव्य:',
    calibratedScaleOnboard: 'कांटा वाहन में स्थापित',
    mission: 'कार्य:',
    settlementMethod: 'भुगतान एवं निपटान विधि',
    cash: '💵 नकद',
    bank: '🏦 बैंक',
    paymentSignedOffScale: 'धर्मकांटे पर वजन पुष्टि के बाद भुगतान संपन्न',
    traceabilityAudit: 'ट्रेसेबिलिटी एवं ऑडिट',
    cpcbAuditReady: 'CPCB ऑडिट तैयार',
    auditStep1Title: '१. सत्यापित GPS उद्गम',
    auditStep1Desc: 'यार्ड संग्रह स्थल पर जियो-टैग्ड निर्देशांक दर्ज।',
    auditStep2Title: '२. प्रमाणित धर्मकांटा',
    auditStep2Desc: 'मापविज्ञान अधिनियम के तहत सकल एवं शुद्ध वजन मुद्रांकित।',
    auditStep3Title: '३. डिजिटल हैंडओवर फ़ोटो',
    auditStep3Desc: 'भुगतान वितरण से पूर्व स्क्रैप लॉट का दृश्य प्रमाण सुरक्षित।',
    auditStep4Title: '४. CPCB EPR प्रमाण पत्र',
    auditStep4Desc: 'वार्षिक EPR लक्ष्यों हेतु तुरंत डिजिटल क्रेडिट जारी।',
    downloadLedgerCsv: 'लेनदेन लेज़र डाउनलोड करें (CSV)',
    
    // Tab 2 - Fleet Logistics
    activeFleetHeader: 'सक्रिय वाहन बेड़ा एवं संग्रह मार्ग',
    activeFleetSubtitle: 'संयंत्र को सौंपे गए वाहनों की लाइव जीपीएस ट्रैकिंग',
    dispatchNewVehicle: 'नया वाहन रवाना करें',
    vehicleNumber: 'वाहन #',
    currentPayload: 'वर्तमान भार',
    eta: 'पहुंच समय:',
    statusInTransit: 'मार्ग में',
    statusLoading: 'यार्ड में लोडिंग',
    statusEnRoute: 'संयंत्र की ओर',
    statusDispatched: 'रवाना हुआ',
    
    // Tab 3 - Material Inventory
    plantInventoryHeader: 'संयंत्र सामग्री इन्वेंटरी एवं स्क्रैप स्टॉक',
    plantInventorySubtitle: 'पुनर्चक्रण एवं प्रगलन हेतु तैयार स्टॉक',
    totalStockBadge: 'कुल स्टॉक: ४२.८ मीट्रिक टन',
    storageLocation: 'भंडारण स्थल:',
    availableStock: 'उपलब्ध स्टॉक',
    inventoryValuation: 'इन्वेंटरी मूल्यांकन',
    
    // Tab 4 - Spot Price Engine
    priceEngineHeader: 'स्पॉट मूल्य इंजन एवं खरीद दरें',
    priceEngineSubtitle: 'कबाड़ियों एवं यार्डों हेतु CPCB-अनुरूप बेंचमार्क मूल्य',
    materialCategoryCol: 'सामग्री श्रेणी',
    cpcbCodeCol: 'CPCB कोड',
    spotBenchmarkCol: 'स्पॉट बेंचमार्क',
    minFloorRateCol: 'न्यूनतम आधार दर',
    recyclerOfferCol: 'रीसायकलर ऑफर',
    statusCol: 'स्थिति',
    activeOffer: 'सक्रिय ऑफर',
    broadcastAutoNotice: 'लाइव दरें सभी क्षेत्रीय यार्डों और कबाड़ियों को स्वतः प्रसारित होती हैं',
    broadcastRatesBtn: 'लाइव खरीद दरें प्रसारित करें',
    broadcastingBtn: 'दरें प्रसारित हो रही हैं...',
    
    // Tab 5 - EPR Traceability
    cpcbRegistryHeader: 'CPCB EPR प्रमाण पत्र रजिस्ट्री',
    cpcbRegistrySubtitle: 'राष्ट्रीय EPR लक्ष्यों की पूर्ति हेतु जारी अधिकृत ई-कचरा प्रमाण पत्र',
    exportEprLedgerCsv: 'EPR लेज़र निर्यात करें (CSV)',
    viewForm6ManifestLink: 'फॉर्म-६ मेनिफेस्ट देखें',
    settledVia: 'भुगतान:',
    
    // Tab 6 - Facility Settings
    facilitySettingsHeader: 'संयंत्र प्राधिकरण एवं कैलिब्रेशन सेटिंग्स',
    facilitySettingsSubtitle: 'संयंत्र के लिए वैधानिक मानक एवं विनिर्देश',
    cpcbProfileTitle: 'CPCB पंजीकरण विवरण',
    regNumber: 'पंजीकरण संख्या',
    operatingTerritory: 'संयंत्र संचालन क्षेत्र',
    authorizedCategories: 'अधिकृत ई-कचरा श्रेणियां',
    metrologyCalibrationTitle: 'धर्मकांटा मापविज्ञान कैलिब्रेशन',
    scaleCalibratedOn: 'कांटा अंशांकन तिथि',
    nextRecalibrationDue: 'अगला अंशांकन देय',
    validBadge: 'वैध',
    weightTolerance: 'स्वीकार्य वजन सहनशीलता',
    standardToleranceDesc: '±०.१ किग्रा मानक फील्ड विचलन',
    runSelfTestBtn: 'धर्मकांटा सेल्फ़-टेस्ट एवं शून्य-टेयर जांचें',
    runningTestBtn: 'सेंसर लोड टेस्ट जारी...',
    calibrationStatus: 'कैलिब्रेशन स्थिति:',
    tareZeroBalance: 'शून्य टेयर संतुलन:',
    variance: 'विचलन:',
    
    // Modals
    weighbridgeModalTitle: 'धर्मकांटा तौल सत्यापन एवं प्रमाणन',
    collectorOrigin: 'कलेक्टर / मूल स्रोत',
    assignedRecycler: 'अधिकृत रीसायकलर',
    actualNetWeightInput: 'प्रमाणित कांटे का वास्तविक शुद्ध वजन (किग्रा):',
    statedCollectorWeight: 'कलेक्टर द्वारा दर्ज वजन:',
    scaleVariance: 'कांटा अंतर:',
    settlementAmount: 'भुगतान राशि',
    dualSignoffCheckbox: 'कलेक्टर एवं ऑपरेटर द्वारा संयुक्त सत्यापन संपन्न',
    metrologyStandardCheckbox: 'विधिक मापविज्ञान मानकों के अनुसार कांटा प्रमाणित',
    cancel: 'रद्द करें',
    issueCpcbCertificateBtn: 'CPCB प्रमाण पत्र जारी करें',
    issuingCertificateBtn: 'जारी कर रहे हैं...',
    
    dispatchModalTitle: 'फ्लीट वाहन रवाना करें',
    dispatchModalSubtitle: 'प्रमाणित कांटे से सुसज्जित वाहन को गंतव्य पर भेजें',
    vehicleRegNumber: 'वाहन पंजीकरण संख्या',
    driverName: 'चालक का नाम',
    driverPhone: 'चालक का फोन',
    targetHub: 'गंतव्य एकत्रीकरण यार्ड',
    vehicleType: 'वाहन का प्रकार',
    payloadCapacity: 'वहन क्षमता (किग्रा)',
    certifiedScaleIncluded: 'वाहन में विधिक मापविज्ञान प्रमाणित डिजिटल कांटा संलग्न',
    confirmDispatchBtn: 'डिस्पैच की पुष्टि करें',
    dispatchingBtn: 'रवाना हो रहा है...'
  },
  mr: {
    brandSub: 'रिसायकलर',
    online: 'ऑनलाइन',
    authorizedFacility: 'अधिकृत संयंत्र',
    selectFacility: 'संयंत्र निवडा',
    plantOps: 'प्लांट ऑपरेशन्स',
    weighbridgeAdmin: 'वजनकाटा व्यवस्थापक',
    adminTools: 'प्रशासक साधने',
    notifications: 'सूचना',
    signOut: 'साइन आउट / भूमिका बदला',
    authorizedRecyclerDesk: 'अधिकृत रिसायकलर डेस्क',
    location: 'स्थान:',
    scaleStatus: 'काटा स्थिती:',
    digitalCertified: 'डिजिटल प्रमाणित (±0.02 किलो)',
    monthlyQuota: 'मासिक कोटा',
    target: 'लक्ष्य:',
    
    // Tabs
    tabIncomingLots: 'येणारे लॉट्स',
    tabActivePickups: 'सक्रिय पिकअप',
    tabMaterialInventory: 'सामग्री साठा',
    tabPriceQuotes: 'खरेदी दर व कोट्स',
    tabTraceabilityEpr: 'ट्रेसेबिलिटी व CPCB',
    tabFacilitySettings: 'संयंत्र सेटिंग्ज',
    
    // Top Overview Metrics Strip
    metricIncomingLots: 'येणारे लॉट्स',
    active: 'सक्रिय',
    urgentWithin10km: '५ तातडीचे < १० किमी',
    activeClusters: 'सक्रिय क्लस्टर्स',
    pendingQuotes: 'प्रलंबित कोट्स',
    inBidding: 'बोली सुरू',
    avgResponse12m: 'सरासरी वेळ: १२ मि',
    negotiationOpen: 'चर्चा खुली',
    todaysSettlements: 'आजचे पेमेंट',
    instant: 'तत्काळ',
    directToAggregators: 'कबाडींना थेट पेमेंट',
    zeroCommission: 'शून्य कमिशन',
    verifiedTonnage: 'सत्यापित एकूण वजन',
    facilityQuota: 'संयंत्र कोटा',
    
    // Confirmation Banner
    weighbridgeConfirmedTitle: 'वजनकाटा हस्तांतरण निश्चित • CPCB प्रमाणपत्र जारी',
    viewForm6Manifest: 'फॉर्म-६ मॅनिफेस्ट पहा',
    dismiss: 'बंद करा',
    
    // Filters & Inbound Lots
    categoryFilterLabel: 'वर्गवारी:',
    all: 'सर्व',
    allLotsWithCount: (cnt) => `सर्व लॉट (${cnt})`,
    circuitBoards: 'सर्किट बोर्ड',
    copperCables: 'तांब्याची केबल',
    pcb: 'पीसीबी',
    cables: 'केबल्स',
    batteries: 'बॅटरी',
    displays: 'डिस्प्ले',
    appliances: 'उपकरणे',
    distance: 'अंतर:',
    allDistances: 'संपूर्ण परिसर',
    within5km: '५ किमी परिसरात',
    within10km: '१० किमी परिसरात',
    within25km: '२५ किमी परिसरात',
    noLotsFound: 'फिल्टरनुसार कोणतेही लॉट उपलब्ध नाहीत',
    resetFilters: 'फिल्टर्स पूर्ववत करा',
    dealerPallet: 'डीलर पॅलेट',
    certifiedInbound: 'प्रमाणित आवक',
    verifiedGrossWeight: 'सत्यापित एकूण वजन',
    netWeight: 'निव्वळ वजन',
    collectorAsking: 'कलेक्टर मागणी',
    marketRange: 'बाजार भाव',
    aiPurity: 'AI शुद्धता',
    sourceOrigin: 'मूळ स्रोत',
    aggregatorYard: 'यार्ड संकलन',
    doorstepCollector: 'घरोघरी कबाडी',
    fulfillmentMode: 'खरेदी दर कोट करा:',
    vanPickup: 'व्हॅन पिकअप',
    selfDropoff: 'थेट डिलिव्हरी',
    totalValue: 'एकूण मूल्य:',
    dispatchFleet: 'गाडी पाठवा',
    counterOffer: 'काउंटर ऑफर',
    offerSent: 'ऑफर पाठवली',
    viewCpcbCert: 'CPCB प्रमाणपत्र पहा',
    acceptAndWeighbridge: 'स्वीकारा व वजन काटा',
    quoteProcurementRate: 'खरेदी दर कोट करा',
    quotedRate: 'कोट केलेला दर',
    confirmWeighbridgeAccept: 'वजनकाटा पडताळा व स्वीकारा',
    issueForm6Manifest: 'फॉर्म-६ जारी करा',
    digitalLogReady: 'डिजिटल नोंद सज्ज',
    cpcbCode: 'CPCB कोड:',
    scaleCalibrated: 'वजनकाटा प्रमाणित',
    eprVerificationStandard: 'EPR पडताळणी मानक',
    
    // Right Column Logistics & Audit
    todaysDispatchLine: 'आजची डिस्पॅच लाइन',
    scheduledCount: '८ नियोजित',
    driver: 'चालक:',
    destination: 'गंतव्य:',
    calibratedScaleOnboard: 'वजनकाटा वाहनावर सज्ज',
    mission: 'मोहीम:',
    settlementMethod: 'पेमेंट व व्यवहार पद्धत',
    cash: '💵 रोख',
    bank: '🏦 बँक',
    paymentSignedOffScale: 'वजनकाट्यावर मोजणीनंतर पेमेंट संपन्न',
    traceabilityAudit: 'ट्रेसेबिलिटी व ऑडिट',
    cpcbAuditReady: 'CPCB ऑडिट सज्ज',
    auditStep1Title: '१. सत्यापित GPS मूळ',
    auditStep1Desc: 'यार्ड संकलन स्थळावर जिओ-टॅग्ड निर्देशांक नोंदवले.',
    auditStep2Title: '२. प्रमाणित वजनकाटा',
    auditStep2Desc: 'वजनमापे कायद्यांतर्गत एकूण व निव्वळ वजन प्रमाणित.',
    auditStep3Title: '३. डिजिटल हस्तांतरण फोटो',
    auditStep3Desc: 'पेमेंट वितरणापूर्वी स्क्रॅप लॉटचे फोटो पुरावे सुरक्षित.',
    auditStep4Title: '४. CPCB EPR प्रमाणपत्र',
    auditStep4Desc: 'वार्षिक EPR उद्दिष्टांसाठी तत्काळ डिजिटल क्रेडिट जारी.',
    downloadLedgerCsv: 'व्यवहार लेजर डाउनलोड करा (CSV)',
    
    // Tab 2 - Fleet Logistics
    activeFleetHeader: 'सक्रिय फ्लीट व संकलन मार्ग',
    activeFleetSubtitle: 'संयंत्राला नियुक्त वाहनांचे थेट जीपीएस ट्रॅकिंग',
    dispatchNewVehicle: 'नवीन वाहन पाठवा',
    vehicleNumber: 'वाहन #',
    currentPayload: 'वर्तमान पेलोड',
    eta: 'पोहोच वेळ:',
    statusInTransit: 'मार्गावर',
    statusLoading: 'यार्डमध्ये लोडिंग',
    statusEnRoute: 'संयंत्राकडे',
    statusDispatched: 'रवाना',
    
    // Tab 3 - Material Inventory
    plantInventoryHeader: 'संयंत्र सामग्री साठा व स्क्रॅप स्टॉक',
    plantInventorySubtitle: 'पुनर्वापर व प्रगलनासाठी तयार साठा',
    totalStockBadge: 'एकूण साठा: ४२.८ मेट्रिक टन',
    storageLocation: 'साठा स्थान:',
    availableStock: 'उपलब्ध साठा',
    inventoryValuation: 'साठा मूल्यांकन',
    
    // Tab 4 - Spot Price Engine
    priceEngineHeader: 'स्पॉट दर इंजिन व खरेदी दर',
    priceEngineSubtitle: 'कबाडी व यार्डसाठी CPCB-सुसंगत बेंचमार्क दर',
    materialCategoryCol: 'साहित्य प्रवर्ग',
    cpcbCodeCol: 'CPCB कोड',
    spotBenchmarkCol: 'स्पॉट बेंचमार्क',
    minFloorRateCol: 'किमान आधारभूत दर',
    recyclerOfferCol: 'रिसायकलर ऑफर',
    statusCol: 'स्थिती',
    activeOffer: 'सक्रिय ऑफर',
    broadcastAutoNotice: 'थेट दर सर्व स्थानिक यार्ड आणि कबाडींना आपोआप प्रसारित होतात',
    broadcastRatesBtn: 'थेट खरेदी दर प्रसारित करा',
    broadcastingBtn: 'दर प्रसारित होत आहेत...',
    
    // Tab 5 - EPR Traceability
    cpcbRegistryHeader: 'CPCB EPR प्रमाणपत्र नोंदणी',
    cpcbRegistrySubtitle: 'राष्ट्रीय EPR उद्दिष्टपूर्तीसाठी जारी अधिकृत ई-कचरा प्रमाणपत्रे',
    exportEprLedgerCsv: 'EPR लेजर निर्यात करा (CSV)',
    viewForm6ManifestLink: 'फॉर्म-६ मॅनिफेस्ट पहा',
    settledVia: 'पेमेंट:',
    
    // Tab 6 - Facility Settings
    facilitySettingsHeader: 'संयंत्र प्राधिकरण व कॅलिब्रेशन सेटिंग्ज',
    facilitySettingsSubtitle: 'संयंत्रासाठी वैधानिक निकष व तपशील',
    cpcbProfileTitle: 'CPCB नोंदणी माहिती',
    regNumber: 'नोंदणी क्रमांक',
    operatingTerritory: 'संयंत्र कार्यक्षेत्र',
    authorizedCategories: 'अधिकृत ई-कचरा प्रवर्ग',
    metrologyCalibrationTitle: 'वजनकाटा वजनमापे कॅलिब्रेशन',
    scaleCalibratedOn: 'काटा प्रमाणीकरण दिनांक',
    nextRecalibrationDue: 'पुढील प्रमाणीकरण देय',
    validBadge: 'वैध',
    weightTolerance: 'स्वीकार्य वजन तफावत',
    standardToleranceDesc: '±०.१ किलो प्रमाणित फरक',
    runSelfTestBtn: 'वजनकाटा सेल्फ-टेस्ट व झिरो-टेअर चालवा',
    runningTestBtn: 'सेन्सर लोड टेस्ट सुरू...',
    calibrationStatus: 'कॅलिब्रेशन स्थिती:',
    tareZeroBalance: 'झिरो टेअर बॅलन्स:',
    variance: 'तफावत:',
    
    // Modals
    weighbridgeModalTitle: 'वजनकाटा तपासणी व प्रमाणीकरण',
    collectorOrigin: 'कलेक्टर / मूळ स्थान',
    assignedRecycler: 'नियुक्त रिसायकलर',
    actualNetWeightInput: 'प्रमाणित काट्यावरील प्रत्यक्ष निव्वळ वजन (किलो):',
    statedCollectorWeight: 'कलेक्टरचे नोंदवलेले वजन:',
    scaleVariance: 'काटा फरक:',
    settlementAmount: 'पेमेंट रक्कम',
    dualSignoffCheckbox: 'कलेक्टर व ऑपरेटर यांच्यात संयुक्त तपासणी पूर्ण',
    metrologyStandardCheckbox: 'कायदेशीर वजनमापे मानकांनुसार काटा प्रमाणित',
    cancel: 'रद्द करा',
    issueCpcbCertificateBtn: 'CPCB प्रमाणपत्र जारी करा',
    issuingCertificateBtn: 'जारी करत आहे...',
    
    dispatchModalTitle: 'फ्लीट वाहन पाठवा',
    dispatchModalSubtitle: 'प्रमाणित काट्यासह संकलन वाहन तैनात करा',
    vehicleRegNumber: 'वाहन नोंदणी क्रमांक',
    driverName: 'चालकाचे नाव',
    driverPhone: 'चालकाचा फोन',
    targetHub: 'गंतव्य संकलन यार्ड',
    vehicleType: 'वाहनाचा प्रकार',
    payloadCapacity: 'भार क्षमता (किलो)',
    certifiedScaleIncluded: 'वाहनावर कायदेशीर वजनमापे प्रमाणित डिजिटल काटा समाविष्ट',
    confirmDispatchBtn: 'डिस्पॅच निश्चित करा',
    dispatchingBtn: 'रवाना होत आहे...'
  },
  en: {
    brandSub: 'Recycler',
    online: 'Online',
    authorizedFacility: 'Authorized Facility',
    selectFacility: 'Select Facility',
    plantOps: 'Plant Ops',
    weighbridgeAdmin: 'Weighbridge Admin',
    adminTools: 'Admin Tools',
    notifications: 'Notifications',
    signOut: 'Sign Out / Switch Role',
    authorizedRecyclerDesk: 'Authorized Recycler Desk',
    location: 'Location:',
    scaleStatus: 'Scale Status:',
    digitalCertified: 'Digital Certified (±0.02kg)',
    monthlyQuota: 'Monthly Quota',
    target: 'Target:',
    
    // Tabs
    tabIncomingLots: 'Incoming Lots',
    tabActivePickups: 'Active Pickups',
    tabMaterialInventory: 'Material Inventory',
    tabPriceQuotes: 'Price & Quotes',
    tabTraceabilityEpr: 'Traceability & EPR',
    tabFacilitySettings: 'Facility Settings',
    
    // Top Overview Metrics Strip
    metricIncomingLots: 'Incoming Lots',
    active: 'Active',
    urgentWithin10km: '5 urgent < 10 km',
    activeClusters: 'Active Clusters',
    pendingQuotes: 'Pending Quotes',
    inBidding: 'In Bidding',
    avgResponse12m: 'Avg response: 12m',
    negotiationOpen: 'Negotiation Open',
    todaysSettlements: "Today's Settlements",
    instant: 'Instant',
    directToAggregators: 'Direct to Aggregators',
    zeroCommission: 'Zero Commission',
    verifiedTonnage: 'Verified Tonnage',
    facilityQuota: 'Facility Quota',
    
    // Confirmation Banner
    weighbridgeConfirmedTitle: 'Weighbridge Handover Confirmed • CPCB Certificate Issued',
    viewForm6Manifest: 'View Form-6 Manifest',
    dismiss: 'Dismiss',
    
    // Filters & Inbound Lots
    categoryFilterLabel: 'Category:',
    all: 'All',
    allLotsWithCount: (cnt) => `All Lots (${cnt})`,
    circuitBoards: 'Circuit Boards',
    copperCables: 'Copper Cables',
    pcb: 'PCB',
    cables: 'Cables',
    batteries: 'Batteries',
    displays: 'Displays',
    appliances: 'Appliances',
    distance: 'Distance:',
    allDistances: 'All Territory',
    within5km: 'Within 5 km Radius',
    within10km: 'Within 10 km Radius',
    within25km: 'Within 25 km Radius',
    noLotsFound: 'No lots matching your filter',
    resetFilters: 'Reset Filters',
    dealerPallet: 'Dealer Pallet',
    certifiedInbound: 'Certified Inbound',
    verifiedGrossWeight: 'Verified Gross Weight',
    netWeight: 'Net Weight',
    collectorAsking: 'Collector Asking',
    marketRange: 'Market Range',
    aiPurity: 'AI Purity',
    sourceOrigin: 'Source Origin',
    aggregatorYard: 'Aggregator Yard',
    doorstepCollector: 'Doorstep Collector',
    fulfillmentMode: 'Quote Procurement Rate:',
    vanPickup: 'Van Pickup',
    selfDropoff: 'Self Dropoff',
    totalValue: 'Total Value:',
    dispatchFleet: 'Dispatch Fleet',
    counterOffer: 'Counter-Offer',
    offerSent: 'Offer Sent',
    viewCpcbCert: 'View CPCB Cert',
    acceptAndWeighbridge: 'Accept & Weighbridge',
    quoteProcurementRate: 'Quote Procurement Rate',
    quotedRate: 'Quoted Rate',
    confirmWeighbridgeAccept: 'Confirm Weighbridge & Accept',
    issueForm6Manifest: 'Issue Form-6 Manifest',
    digitalLogReady: 'Digital Log Ready',
    cpcbCode: 'CPCB Code:',
    scaleCalibrated: 'Scale Calibrated',
    eprVerificationStandard: 'EPR Verification Standard',
    
    // Right Column Logistics & Audit
    todaysDispatchLine: "Today's Dispatch Line",
    scheduledCount: '8 Scheduled',
    driver: 'Driver:',
    destination: 'Destination:',
    calibratedScaleOnboard: 'Calibrated Scale on-board',
    mission: 'Mission:',
    settlementMethod: 'Settlement & Payment Method',
    cash: '💵 Cash',
    bank: '🏦 Bank',
    paymentSignedOffScale: 'Payment signed off on physical weighbridge',
    traceabilityAudit: 'Traceability & Audit',
    cpcbAuditReady: 'CPCB Audit Ready',
    auditStep1Title: '1. Verified GPS Origin',
    auditStep1Desc: 'Handover coordinates locked at aggregator site.',
    auditStep2Title: '2. Calibrated Weighbridge',
    auditStep2Desc: 'Gross and net weight stamped under Metrology Act.',
    auditStep3Title: '3. Digital Handover Photos',
    auditStep3Desc: 'Lot evidence captured before payout disbursement.',
    auditStep4Title: '4. CPCB EPR Certificate',
    auditStep4Desc: 'Instant EPR credit compliance issuance.',
    downloadLedgerCsv: 'Download Transaction Ledger (CSV)',
    
    // Tab 2 - Fleet Logistics
    activeFleetHeader: 'Active Fleet & Collection Routes',
    activeFleetSubtitle: 'Real-time tracking of collection vehicles',
    dispatchNewVehicle: 'Dispatch New Vehicle',
    vehicleNumber: 'Vehicle #',
    currentPayload: 'Current Payload',
    eta: 'ETA:',
    statusInTransit: 'In Transit',
    statusLoading: 'Loading at Yard',
    statusEnRoute: 'En Route to Facility',
    statusDispatched: 'Dispatched',
    
    // Tab 3 - Material Inventory
    plantInventoryHeader: 'Plant Material Inventory & Scrap Stock',
    plantInventorySubtitle: 'Live bay allocations and scrap inventory ready for valorization & smelting',
    totalStockBadge: 'Total Stock: 42.8 MT',
    storageLocation: 'Storage Location:',
    availableStock: 'Available Stock',
    inventoryValuation: 'Inventory Valuation',
    
    // Tab 4 - Spot Price Engine
    priceEngineHeader: 'Spot Price Engine & Procurement Rates',
    priceEngineSubtitle: 'CPCB-aligned benchmark pricing bands for regional aggregators & door-to-door pickers',
    materialCategoryCol: 'Material Category',
    cpcbCodeCol: 'CPCB Code',
    spotBenchmarkCol: 'Spot Benchmark',
    minFloorRateCol: 'Min Floor Rate',
    recyclerOfferCol: 'Recycler Offer',
    statusCol: 'Status',
    activeOffer: 'Active Offer',
    broadcastAutoNotice: 'Live rates automatically broadcast to all regional aggregator desks and field pickers',
    broadcastRatesBtn: 'Broadcast Live Procurement Rates',
    broadcastingBtn: 'Broadcasting Rates...',
    
    // Tab 5 - EPR Traceability
    cpcbRegistryHeader: 'CPCB EPR Certificate Registry',
    cpcbRegistrySubtitle: 'Official e-waste recycling certificates issued for national EPR target fulfillment',
    exportEprLedgerCsv: 'Export EPR Ledger (CSV)',
    viewForm6ManifestLink: 'View Form-6 Manifest',
    settledVia: 'Settled:',
    
    // Tab 6 - Facility Settings
    facilitySettingsHeader: 'Plant Authorization & Calibration Settings',
    facilitySettingsSubtitle: 'Regulated facility parameters',
    cpcbProfileTitle: 'CPCB Registration Profile',
    regNumber: 'Registration Number',
    operatingTerritory: 'Plant Operating Territory',
    authorizedCategories: 'Authorized E-Waste Categories',
    metrologyCalibrationTitle: 'Weighbridge Metrology Calibration',
    scaleCalibratedOn: 'Scale Calibrated On',
    nextRecalibrationDue: 'Next Recalibration Due',
    validBadge: 'Valid',
    weightTolerance: 'Acceptable Weight Tolerance',
    standardToleranceDesc: '±0.1 kg standard field variance',
    runSelfTestBtn: 'Run Metrology Self-Test & Zero-Tare',
    runningTestBtn: 'Running Sensor Load Test...',
    calibrationStatus: 'Calibration Status:',
    tareZeroBalance: 'Tare Zero Balance:',
    variance: 'Variance:',
    
    // Modals
    weighbridgeModalTitle: 'Weighbridge Scale Verification',
    collectorOrigin: 'Collector / Origin',
    assignedRecycler: 'Assigned Recycler',
    actualNetWeightInput: 'Calibrated Scale Actual Net Weight (kg):',
    statedCollectorWeight: 'Stated Collector Weight:',
    scaleVariance: 'Scale Variance:',
    settlementAmount: 'Settlement Amount',
    dualSignoffCheckbox: 'Dual visual signoff completed between collector & weighbridge operator',
    metrologyStandardCheckbox: 'Physical scale calibrated according to Legal Metrology Standards',
    cancel: 'Cancel',
    issueCpcbCertificateBtn: 'Issue CPCB Certificate',
    issuingCertificateBtn: 'Issuing...',
    
    dispatchModalTitle: 'Dispatch Fleet Vehicle',
    dispatchModalSubtitle: 'Deploy collection vehicle with calibrated scale',
    vehicleRegNumber: 'Vehicle Registration Number',
    driverName: 'Driver Name',
    driverPhone: 'Driver Phone',
    targetHub: 'Destination Aggregation Hub / Yard',
    vehicleType: 'Vehicle Type',
    payloadCapacity: 'Payload Capacity (kg)',
    certifiedScaleIncluded: 'Includes Legal Metrology Certified Digital Scale onboard',
    confirmDispatchBtn: 'Confirm Dispatch',
    dispatchingBtn: 'Dispatching...'
  }
};

export default function RecyclerDashboard({ onRoleSwitch, currentLang: propLang, onLanguageChange: propOnLanguageChange }) {
  const { i18n } = useTranslation();
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [internalLang, setInternalLang] = useState(() => normalize(propLang || i18n?.language || localStorage.getItem('relink_lang')));

  useEffect(() => {
    if (propLang) {
      setInternalLang(normalize(propLang));
    }
  }, [propLang]);

  const currentLang = normalize(propLang || internalLang);
  const t = RECYCLER_TRANSLATIONS[currentLang] || RECYCLER_TRANSLATIONS.hi;

  const handleLanguageCycle = () => {
    const cycle = { hi: 'mr', mr: 'en', en: 'hi' };
    const next = cycle[currentLang] || 'hi';
    setInternalLang(next);
    localStorage.setItem('relink_lang', next);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(next);
    }
    if (propOnLanguageChange) {
      propOnLanguageChange(next);
    }
  };

  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);
  const [activeTab, setActiveTab] = useState('incoming-lots');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [radiusFilter, setRadiusFilter] = useState('10');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lots, setLots] = useState([]);
  const [metrics, setMetrics] = useState({
    total_incoming_lots: 14,
    pending_verification_count: 6,
    confirmed_count: 8,
    total_verified_tonnage_mt: 42.8,
    total_payout_settled_inr: 342000,
    cpcb_certificates_issued: 8
  });
  const [isLoading, setIsLoading] = useState(false);

  // Per-lot pricing & fulfillment state
  const [rates, setRates] = useState({});
  const [fulfillments, setFulfillments] = useState({});
  const [settlementMode, setSettlementMode] = useState('CASH');

  // Weighbridge & CPCB Confirmation Modal
  const [inspectLot, setInspectLot] = useState(null);
  const [weighbridgeInput, setWeighbridgeInput] = useState('');
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const [selectedManifestData, setSelectedManifestData] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [actionToast, setActionToast] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    vehicle_no: '',
    driver_name: '',
    driver_phone: '',
    target_collector_hub: 'Peenya Aggregation Yard (Yard 04)',
    vehicle_type: 'Van (3-Wheeler / Tata Ace)',
    capacity_kg: 800
  });

  // Fleet Dispatches Dynamic State
  const [fleetVehicles, setFleetVehicles] = useState([
    {
      id: 'KA-04-E-2091',
      driver: 'Suresh M.',
      phone: '+91 98450 12891',
      dest: 'Ramesh K. (Peenya Aggregator)',
      payload: '480 / 800 kg',
      status: 'In Transit',
      eta: '18 mins',
      scale: 'Calibrated Scale Certified'
    },
    {
      id: 'KA-02-B-9912',
      driver: 'Anil Gowda',
      phone: '+91 94481 00214',
      dest: 'Yeshwanthpur Industrial Aggregators',
      payload: '950 / 1200 kg',
      status: 'Loading at Yard',
      eta: 'On Site',
      scale: 'Digital Crane Scale Attached'
    },
    {
      id: 'MH-03-CB-4410',
      driver: 'Vikram Jadhav',
      phone: '+91 98200 44102',
      dest: 'Dharavi Link Road Scrap Market',
      payload: '620 / 1000 kg',
      status: 'En Route to Facility',
      eta: '25 mins',
      scale: 'Calibrated Scale Certified'
    },
    {
      id: 'KA-05-AB-7721',
      driver: 'Raju Narain',
      phone: '+91 97410 77219',
      dest: 'Rajajinagar Industrial E-Waste Hub',
      payload: '320 / 600 kg',
      status: 'Dispatched',
      eta: '40 mins',
      scale: 'Calibrated Scale Certified'
    }
  ]);

  // Tab 4 Procurement Rates Dynamic State
  const [procurementBands, setProcurementBands] = useState([
    { id: 'ITEW1-PCB-HG', cat: 'Printed Circuit Boards (Grade A)', code: 'ITEW1-PCB-HG', spot: '₹700 – ₹766/kg', floor: 650, offer: 780, status: 'Active Offer' },
    { id: 'ITEW1-PCB-MG', cat: 'Printed Circuit Boards (Grade B/C)', code: 'ITEW1-PCB-MG', spot: '₹350 – ₹420/kg', floor: 300, offer: 390, status: 'Active Offer' },
    { id: 'ITEW-CBL-CU', cat: 'Insulated Copper Cables', code: 'ITEW-CBL-CU', spot: '₹400 – ₹430/kg', floor: 380, offer: 420, status: 'Active Offer' },
    { id: 'BATT-LI-ION', cat: 'Li-ion Battery Modules', code: 'BATT-LI-ION', spot: '₹95 – ₹120/kg', floor: 85, offer: 110, status: 'Active Offer' },
    { id: 'BATT-LEAD-01', cat: 'Lead Acid Smelter Plates', code: 'BATT-LEAD-01', spot: '₹80 – ₹95/kg', floor: 72, offer: 88, status: 'Active Offer' }
  ]);
  const [isBroadcastingRates, setIsBroadcastingRates] = useState(false);
  const [rateBroadcastBanner, setRateBroadcastBanner] = useState(null);

  // Tab 6 Calibration Testing State
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationResult, setCalibrationResult] = useState(null);

  const getCategoryFallbackImage = (cat) => {
    const c = String(cat || '').toUpperCase();
    if (c.includes('PCB') || c.includes('CIRCUIT')) return '/assets/categories/pcb_high.jpg';
    if (c.includes('CABLE') || c.includes('COPPER') || c.includes('WIRE')) return '/assets/categories/copper_cable.jpg';
    if (c.includes('BATT')) return '/assets/categories/battery_lead.jpg';
    if (c.includes('CRT') || c.includes('MONITOR')) return '/assets/categories/crt_monitor.jpg';
    if (c.includes('LCD') || c.includes('DISP')) return '/assets/categories/lcd_panel.jpg';
    if (c.includes('PLAST')) return '/assets/categories/mixed_plastics.jpg';
    if (c.includes('MOTOR') || c.includes('MAG')) return '/assets/categories/motors_magnets.jpg';
    return '/assets/categories/pcb_high.jpg';
  };

  const syncBroadcastRates = (bands = procurementBands) => {
    const pcbBand = bands.find(b => b.id === 'ITEW1-PCB-HG')?.offer || 780;
    const pcbMidBand = bands.find(b => b.id === 'ITEW1-PCB-MG')?.offer || 390;
    const cableBand = bands.find(b => b.id === 'ITEW-CBL-CU')?.offer || 420;
    const battBand = bands.find(b => b.id === 'BATT-LI-ION')?.offer || 110;
    const leadBand = bands.find(b => b.id === 'BATT-LEAD-01')?.offer || 88;

    const ratesPayload = {
      pcb: pcbBand,
      pcb_mid: pcbMidBand,
      copper: cableBand,
      battery: battBand,
      lead: leadBand,
      facility_id: selectedFacility.id,
      facility_name: selectedFacility.name,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('relink_broadcast_rates', JSON.stringify(ratesPayload));
      localStorage.setItem('relink_procurement_bands', JSON.stringify(bands));
      window.dispatchEvent(new CustomEvent('relink_rates_updated', { detail: ratesPayload }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.log('Rate sync notice:', e);
    }
  };

  useEffect(() => {
    loadFacilityData(selectedFacility.id);
  }, [selectedFacility, categoryFilter]);

  const loadFacilityData = async (facilityId) => {
    setIsLoading(true);
    try {
      // 1. Fetch lots from backend
      let fetchedLots = [];
      try {
        const resLots = await fetch(`${API_BASE}/recyclers/${facilityId}/lots`);
        if (resLots.ok) {
          const dataLots = await resLots.json();
          fetchedLots = dataLots.lots || [];
        }
      } catch (e) {
        console.log('Backend lots fetch skipped/offline:', e);
      }

      // Also get any newly created lots from local offlineDb (instant cross-portal handshake)
      try {
        const localLots = await getRecentOfflineLots(10);
        if (localLots && localLots.length > 0) {
          for (const ll of localLots) {
            if (!fetchedLots.some(fl => fl.id === ll.id || fl.handover_ref === ll.handover_ref)) {
              fetchedLots.unshift({
                id: ll.id,
                handover_ref: ll.handover_ref || `RL-2026-${ll.id.slice(0, 5).toUpperCase()}`,
                material_category: ll.material_category || 'PCB',
                material_id: ll.material_id || 'mat_pcb_high',
                approximate_weight: ll.approximate_weight || 12.0,
                condition: ll.condition || 'Good / Intact',
                quoted_price: ll.quoted_price || 8400,
                image_url: ll.photo_base64 || ll.image_url || ll.image_data_url || getCategoryFallbackImage(ll.material_category),
                ai_confidence: ll.ai_confidence || 0.92,
                status: ll.status || 'PENDING',
                created_at: ll.created_at || new Date().toISOString(),
                general_location: 'Peenya / Dharavi Aggregation Yard'
              });
            }
          }
        }
      } catch (dbErr) {
        console.log('Local lots merge notice:', dbErr);
      }

      // Also check for Dealer Consolidated Pallets (Tier-2 Aggregator Yard -> Tier-1 Industrial Recycler)
      let dealerPallets = [];
      try {
        const savedPallets = localStorage.getItem('relink_dealer_pallets');
        if (savedPallets) {
          const parsed = JSON.parse(savedPallets);
          dealerPallets = (parsed || []).map(p => ({
            ...p,
            priority_label: (p.priority_label || '').replace(/Aggregator Bulk Pallet •\s*/i, '').trim() || 'Certified Inbound',
            time_posted: (p.time_posted || '').includes('Fleet Dispatch') ? 'Ready for Dispatch' : p.time_posted,
            ai_badge: (p.ai_badge || '').includes('Calibrated Scale') ? 'Scale Certified' : p.ai_badge
          }));
        }
      } catch (e) {
        console.log('Error parsing saved dealer pallets:', e);
      }

      if (!dealerPallets || dealerPallets.length === 0) {
        dealerPallets = [
          {
            id: 'PLT-PEENYA-104',
            handover_ref: 'PLT-KA-04-104',
            title: 'Server & Telecom PCB Pallet',
            subtitle: 'Peenya Yard #04 • CPCB Verified Pallet',
            category: 'PCB',
            category_code: 'ITEW1-PCB-HG',
            priority_label: 'Certified Inbound',
            time_posted: 'Ready for Dispatch',
            image_url: '/assets/categories/pcb_high.jpg',
            ai_badge: 'Scale Certified',
            location_label: 'Peenya Yard #04',
            distance_km: 4.8,
            collector_name: 'Dilip Bhai (Peenya Yard #04)',
            collector_rating: 4.95,
            collector_history: 'CPCB Reg #KA-AGG-2024-118 • 112 Pallets',
            net_weight_kg: 350.0,
            collector_asking_rate: 780,
            benchmark_min: 760,
            benchmark_max: 785,
            suggested_rate: 780,
            status: 'PENDING',
            isDealerPallet: true,
            dealerYardName: 'Peenya Industrial Yard #04',
            dealerOwner: 'Dilip Bhai',
            dealerReg: 'CPCB Reg #KA-AGG-2024-118',
            provenance: 'Consolidated from 28 Micro-Collector field lots'
          }
        ];
        try {
          localStorage.setItem('relink_dealer_pallets', JSON.stringify(dealerPallets));
        } catch (e) {}
      }

      // Merge dealer pallets, backend & local lots with rich Stitch prototype cards
      const mergedLots = mergeWithStitchLots(fetchedLots, dealerPallets);
      setLots(mergedLots);

      // Initialize default rates and fulfillment
      const initialRates = {};
      const initialFulfillment = {};
      mergedLots.forEach((l) => {
        initialRates[l.id] = l.offered_rate || l.suggested_rate || 780;
        initialFulfillment[l.id] = 'van';
      });
      setRates((prev) => ({ ...initialRates, ...prev }));
      setFulfillments((prev) => ({ ...initialFulfillment, ...prev }));

      // 2. Fetch metrics from backend
      const resMetrics = await fetch(`${API_BASE}/recyclers/${facilityId}/metrics`);
      if (resMetrics.ok) {
        const dataMetrics = await resMetrics.json();
        if (dataMetrics.metrics) {
          setMetrics((prev) => ({
            ...prev,
            ...dataMetrics.metrics,
            total_verified_tonnage_mt: dataMetrics.metrics.total_verified_tonnage_mt || 42.8
          }));
        }
      }
    } catch (err) {
      console.log('Using local recycler feed fallback:', err);
      const fallback = mergeWithStitchLots([]);
      setLots(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithStitchLots = (backendLots, dealerPallets = []) => {
    const stitchLots = [
      {
        id: 'lot_stitch_00482',
        handover_ref: 'RL-2026-00482',
        title: 'Circuit Boards (Motherboards)',
        subtitle: 'Dual-Socket Server Boards, ICs intact',
        category: 'PCB',
        category_code: 'ITEW1-PCB-HG',
        priority_label: 'Grade A',
        time_posted: '14:15 (42m ago)',
        image_url: '/assets/categories/pcb_high.jpg',
        ai_badge: '92% Verified',
        location_label: 'Peenya Cluster',
        distance_km: 4.8,
        collector_name: 'Ramesh K. (Peenya)',
        collector_rating: 4.8,
        collector_history: '42 Handover Batches',
        net_weight_kg: 12.0,
        collector_asking_rate: 740,
        benchmark_min: 700,
        benchmark_max: 766,
        suggested_rate: 780,
        status: 'PENDING'
      },
      {
        id: 'lot_stitch_00483',
        handover_ref: 'RL-2026-00483',
        title: 'Insulated Copper Cables',
        subtitle: 'Clean stripped telecom copper bundle',
        category: 'CABLES',
        category_code: 'ITEW-CBL-CU',
        priority_label: 'Copper Wire',
        time_posted: '13:30 (1h ago)',
        image_url: '/assets/categories/copper_cable.jpg',
        ai_badge: '89% Verified',
        location_label: 'Yeshwanthpur Yard',
        distance_km: 7.2,
        collector_name: 'Dilip S. (Yard Manager)',
        collector_rating: 4.9,
        collector_history: '88 Batches Handed Over',
        net_weight_kg: 35.0,
        collector_asking_rate: 410,
        benchmark_min: 400,
        benchmark_max: 430,
        suggested_rate: 420,
        status: 'PENDING'
      },
      {
        id: 'lot_stitch_00480',
        handover_ref: 'RL-2026-00480',
        title: 'Li-ion Battery Packs',
        subtitle: 'Intact cells in fire-safe container',
        category: 'BATTERIES',
        category_code: 'BATT-LI-ION',
        priority_label: 'Fire Safe',
        time_posted: 'Offer Sent',
        image_url: '/assets/categories/battery_lead.jpg',
        ai_badge: '86% Verified',
        location_label: 'Rajajinagar Industrial',
        distance_km: 5.1,
        collector_name: 'Imran Bhai',
        collector_rating: 4.7,
        collector_history: 'Specialized Battery Collector',
        net_weight_kg: 18.0,
        collector_asking_rate: 105,
        benchmark_min: 95,
        benchmark_max: 120,
        suggested_rate: 110,
        status: 'OFFER_SENT'
      }
    ];

    // Combine backend lots at top, then stitch lots
    const formattedBackend = backendLots.slice(0, 10).map((b, idx) => {
      const lotId = b.id || b.lot_id || `lot_backend_${idx}`;
      return {
        id: lotId,
        handover_ref: b.handover_ref || `KC-${lotId.slice(0, 8)}`,
        title: `${b.material_category || 'Scrap Material'} (${b.condition || 'Clean'})`,
        subtitle: `Collector Lot #${lotId.slice(0, 6)} • Direct Field Submission`,
        category: (b.material_category || 'PCB').toUpperCase(),
        category_code: b.cpcb_e_waste_code || 'GENERIC-E-WASTE',
        priority_label: b.status === 'CONFIRMED' ? 'Confirmed Handover' : 'Active Field Lot',
        time_posted: new Date(b.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image_url: b.image_url || getCategoryFallbackImage(b.material_category || b.material_name),
        ai_badge: `${Math.round((b.ai_confidence || 0.92) * 100)}% Verified`,
        location_label: b.general_location || 'Dharavi / Kurla Cluster',
        distance_km: 3.2,
        collector_name: b.collector_name || 'Babu Rao (Collector)',
        collector_rating: 4.8,
        collector_history: 'Verified Door-to-Door Picker',
        net_weight_kg: b.approximate_weight || 12.0,
        collector_asking_rate: b.quoted_price ? Math.round(b.quoted_price / (b.approximate_weight || 1)) : 740,
        benchmark_min: 700,
        benchmark_max: 780,
        suggested_rate: b.quoted_price ? Math.round(b.quoted_price / (b.approximate_weight || 1)) : 780,
        status: b.status || 'PENDING'
      };
    });

    const seenIds = new Set();
    const uniqueLots = [];
    for (const lot of [...dealerPallets, ...formattedBackend, ...stitchLots]) {
      if (lot.id && !seenIds.has(lot.id)) {
        seenIds.add(lot.id);
        uniqueLots.push(lot);
      }
    }

    return uniqueLots;
  };

  const filteredLots = lots.filter((lot) => {
    if (categoryFilter !== 'ALL' && lot.category !== categoryFilter) return false;
    if (radiusFilter !== 'ALL' && lot.distance_km > parseFloat(radiusFilter)) return false;
    return true;
  });

  const handleRateChange = (lotId, newRate) => {
    setRates((prev) => ({ ...prev, [lotId]: parseFloat(newRate) || 0 }));
  };

  const handleFulfillmentToggle = (lotId, mode) => {
    setFulfillments((prev) => ({ ...prev, [lotId]: mode }));
  };

  const handleOpenWeighbridgeModal = (lot) => {
    if (lot.status === 'CONFIRMED') {
      setSelectedManifestData({
        cert: `CPCB-EPR-2026-MH-${(lot.id || '994102').slice(-6).toUpperCase()}`,
        certificate_id: `CPCB-EPR-2026-MH-${(lot.id || '994102').slice(-6).toUpperCase()}`,
        lot: lot.handover_ref,
        lot_ref: lot.handover_ref,
        material: lot.title,
        collector: lot.collector_name || (lot.isDealerPallet ? 'Dilip Bhai (Peenya Yard #04)' : 'Babu Rao (Collector)'),
        facility_name: selectedFacility.name,
        weight: lot.net_weight_kg,
        verified_weight: lot.net_weight_kg,
        payout: Math.round(lot.net_weight_kg * (rates[lot.id] || lot.suggested_rate)),
        mode: settlementMode,
        payment_mode: settlementMode,
        isDealerPallet: lot.isDealerPallet,
        dealerYardName: lot.dealerYardName,
        dealerReg: lot.dealerReg,
        provenance: lot.provenance
      });
      return;
    }
    setInspectLot(lot);
    setWeighbridgeInput(lot.net_weight_kg.toString());
  };

  const handleConfirmWeighbridge = async () => {
    if (!inspectLot) return;
    setIsSubmittingConfirm(true);
    const finalWeight = parseFloat(weighbridgeInput) || inspectLot.net_weight_kg;

    let certId = `CPCB-EPR-2026-MH-${Date.now().toString().slice(-8)}`;
    try {
      const res = await fetch(`${API_BASE}/handover/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handover_ref: inspectLot.handover_ref,
          recycler_id: selectedFacility.id,
          verified_weight: finalWeight,
          payment_mode: settlementMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cpcb_certificate_id) certId = data.cpcb_certificate_id;
      }
    } catch (err) {
      console.log('Weighbridge confirm offline fallback:', err);
    } finally {
      const certData = {
        certificate_id: certId,
        cert: certId,
        lot_ref: inspectLot.handover_ref,
        lot: inspectLot.handover_ref,
        material: inspectLot.title,
        verified_weight: finalWeight,
        weight: finalWeight,
        payout: Math.round(finalWeight * (rates[inspectLot.id] || inspectLot.suggested_rate)),
        payment_mode: settlementMode,
        mode: settlementMode,
        collector: inspectLot.collector_name || (inspectLot.isDealerPallet ? 'Dilip Bhai (Peenya Yard #04)' : 'Babu Rao (Collector)'),
        facility_name: selectedFacility.name,
        isDealerPallet: inspectLot.isDealerPallet,
        dealerYardName: inspectLot.dealerYardName,
        dealerReg: inspectLot.dealerReg,
        provenance: inspectLot.provenance
      };

      setConfirmationNotice(certData);
      setSelectedManifestData(certData);

      // Update local status
      setLots((prev) =>
        prev.map((l) => (l.id === inspectLot.id ? { ...l, status: 'CONFIRMED' } : l))
      );
      setMetrics((prev) => ({
        ...prev,
        confirmed_count: prev.confirmed_count + 1,
        total_verified_tonnage_mt: parseFloat((prev.total_verified_tonnage_mt + finalWeight / 1000).toFixed(2)),
        cpcb_certificates_issued: prev.cpcb_certificates_issued + 1
      }));

      setIsSubmittingConfirm(false);
      setInspectLot(null);
    }
  };

  const handleDownloadLedger = () => {
    const headers = ['Lot Reference', 'Material Category', 'Collector', 'Weight (kg)', 'Rate (INR/kg)', 'Total Payout', 'Status', 'Payment Mode'];
    const rows = lots.map((l) => [
      l.handover_ref,
      l.category,
      `"${l.collector_name}"`,
      l.net_weight_kg,
      rates[l.id] || l.suggested_rate,
      Math.round(l.net_weight_kg * (rates[l.id] || l.suggested_rate)),
      l.status,
      settlementMode
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RE_LINK_Recycler_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendCounterOffer = async (lot) => {
    const offerRate = rates[lot.id] || lot.suggested_rate;
    const total = Math.round(lot.net_weight_kg * offerRate);
    const fulfillmentMode = fulfillments[lot.id] || 'van';

    try {
      const res = await fetch(`${API_BASE}/recyclers/${selectedFacility.id}/counter-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: lot.id,
          counter_price_per_kg: offerRate,
          total_counter_offer: total,
          fulfillment_mode: fulfillmentMode,
          note: `Binding counter-offer of ₹${offerRate}/kg from ${selectedFacility.name}`
        })
      });

      setLots((prev) =>
        prev.map((l) =>
          l.id === lot.id
            ? { ...l, status: 'OFFER_SENT', time_posted: `Counter-offer ₹${offerRate}/kg transmitted` }
            : l
        )
      );
      setActionToast({
        title: 'Counter-Offer Transmitted',
        message: `₹${offerRate}/kg (Total ₹${total.toLocaleString('en-IN')}) sent to ${lot.collector_name}.`
      });
    } catch (e) {
      setLots((prev) =>
        prev.map((l) =>
          l.id === lot.id
            ? { ...l, status: 'OFFER_SENT', time_posted: `Counter-offer ₹${offerRate}/kg transmitted` }
            : l
        )
      );
      setActionToast({
        title: 'Counter-Offer Dispatched',
        message: `₹${offerRate}/kg (Total ₹${total.toLocaleString('en-IN')}) sent to ${lot.collector_name}.`
      });
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchForm.vehicle_no || !dispatchForm.driver_name) return;
    setIsSubmittingDispatch(true);

    const newVehicle = {
      id: dispatchForm.vehicle_no,
      driver: dispatchForm.driver_name,
      phone: dispatchForm.driver_phone || '+91 98450 00000',
      dest: dispatchForm.target_collector_hub,
      payload: `0 / ${dispatchForm.capacity_kg} kg`,
      status: 'In Transit',
      eta: '25 mins',
      scale: 'Calibrated Scale Certified'
    };

    try {
      await fetch(`${API_BASE}/recyclers/${selectedFacility.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_no: dispatchForm.vehicle_no,
          driver_name: dispatchForm.driver_name,
          driver_phone: dispatchForm.driver_phone,
          target_collector_hub: dispatchForm.target_collector_hub,
          vehicle_type: dispatchForm.vehicle_type,
          capacity_kg: parseFloat(dispatchForm.capacity_kg) || 800,
          assigned_lots: []
        })
      });
    } catch (err) {
      console.log('Dispatch API fallback handled');
    }

    setFleetVehicles((prev) => [newVehicle, ...prev]);
    setIsSubmittingDispatch(false);
    setShowDispatchModal(false);
    setDispatchForm({
      vehicle_no: '',
      driver_name: '',
      driver_phone: '',
      target_collector_hub: 'Peenya Aggregation Yard (Yard 04)',
      vehicle_type: 'Van (3-Wheeler / Tata Ace)',
      capacity_kg: 800
    });
    setActionToast({
      title: 'Vehicle Dispatched',
      message: `${newVehicle.id} dispatched with driver ${newVehicle.driver} to ${newVehicle.dest}.`
    });
  };

  const handleOfferRateBandChange = (index, newOffer) => {
    const val = parseFloat(newOffer) || 0;
    setProcurementBands((prev) => {
      const updated = prev.map((b, idx) => (idx === index ? { ...b, offer: val } : b));
      syncBroadcastRates(updated);
      return updated;
    });
  };

  const handleBroadcastRates = async () => {
    setIsBroadcastingRates(true);
    syncBroadcastRates(procurementBands);
    const ratesPayload = {};
    procurementBands.forEach((b) => {
      ratesPayload[b.id] = b.offer;
    });

    try {
      await fetch(`${API_BASE}/recyclers/${selectedFacility.id}/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rates: ratesPayload })
      });
      setRateBroadcastBanner(`Live Mandi broadcast synchronized for ${selectedFacility.name}. Rates locked across regional collectors & dealers.`);
      setActionToast({
        title: 'Mandi Rates Broadcasted',
        message: 'Live procurement offers published across regional collector & aggregator networks.'
      });
    } catch (e) {
      setRateBroadcastBanner(`Live Mandi broadcast updated for ${selectedFacility.name}.`);
      setActionToast({
        title: 'Mandi Rates Broadcasted',
        message: 'Rates published to regional network.'
      });
    } finally {
      setIsBroadcastingRates(false);
      setTimeout(() => setRateBroadcastBanner(null), 8000);
    }
  };

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setCalibrationResult(null);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationResult({
        timestamp: new Date().toLocaleTimeString('en-IN'),
        status: 'PASSED',
        tare_verified: '0.000 kg',
        variance: '±0.02 kg (Standard Legal Tolerance ±0.1 kg)',
        inspector_cert: 'Legal Metrology Dept MH-2026-CAL-8812'
      });
      setActionToast({
        title: 'Metrology Scale Certified',
        message: 'Electronic weighbridge zero-balanced and verified under Legal Metrology Act.'
      });
    }, 1800);
  };

  const navItems = [
    {
      id: 'incoming-lots',
      label: t.tabIncomingLots,
      icon: 'inbox',
      badge: filteredLots.length
    },
    {
      id: 'active-pickups',
      label: t.tabActivePickups,
      icon: 'local_shipping',
      badge: '8'
    },
    {
      id: 'material-inventory',
      label: t.tabMaterialInventory,
      icon: 'inventory_2',
      badge: null
    },
    {
      id: 'price-quotes',
      label: t.tabPriceQuotes,
      icon: 'currency_rupee',
      badge: null
    },
    {
      id: 'traceability-epr',
      label: t.tabTraceabilityEpr,
      icon: 'policy',
      badge: 'CPCB'
    },
    {
      id: 'facility-settings',
      label: t.tabFacilitySettings,
      icon: 'tune',
      badge: null
    }
  ];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-4 shadow-sm border-r border-outline-variant/30 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">recycling</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md tracking-tight text-primary font-bold leading-none">
                  RE:LINK
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5 flex items-center gap-1">
                  <span>{t.brandSub}</span>
                  <span className="text-outline-variant">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold lowercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{t.online}</span>
                  </span>
                </span>
              </div>
            </div>
            {/* Close button for mobile drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Authorization Badge */}
          <div className="px-4 my-3">
            <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold text-xs">
                  {t.authorizedFacility}
                </span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedFacility.tier || 'Tier-1'}
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer font-label-lg text-sm ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-on-primary-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Monthly Quota Card */}
        <div className="px-4">
          <div className="bg-surface-container-highest rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                {t.monthlyQuota}
              </span>
              <span className="font-label-md text-xs text-primary font-bold">85.6%</span>
            </div>
            <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '85.6%' }}></div>
            </div>
            <span className="font-body-md text-[11px] text-on-surface-variant leading-tight">
              {t.target} {metrics.total_verified_tonnage_mt || 42.8} / 50 MT
            </span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-30 flex items-center justify-between px-4 sm:px-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Facility Selector Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/40 max-w-[200px] sm:max-w-[280px] md:max-w-[360px] relative">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
              <select
                value={selectedFacility.id}
                onChange={(e) => {
                  const fac = facilities.find((f) => f.id === e.target.value);
                  if (fac) setSelectedFacility(fac);
                }}
                className="bg-transparent font-label-md text-xs text-on-surface font-semibold outline-none cursor-pointer truncate w-full appearance-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none shadow-none pr-5"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id} className="bg-surface text-on-surface">
                    {fac.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant pointer-events-none absolute right-2.5">expand_more</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={handleLanguageCycle}
              className="bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary/30 transition-all cursor-pointer shadow-sm"
              title="Change Language (भाषा बदलें / भाषा बदला)"
            >
              <span className="material-symbols-outlined text-[16px]">translate</span>
              <span>{currentLang === 'hi' ? 'हिन्दी' : (currentLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>

            {/* Admin Tools Modal Button */}
            <button
              onClick={() => setShowAdminModal(true)}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-outline-variant transition-all cursor-pointer shadow-sm"
              title="Access CPCB Master Admin Tools & Mandi Controls"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">admin_panel_settings</span>
              <span className="hidden sm:inline">{t.adminTools}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* Profile Avatar with Interactive Dropdown Menu */}
            <div className="relative pl-1 border-l border-outline-variant/30">
              <button
                type="button"
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="flex items-center gap-2 hover:opacity-90 active:scale-95 cursor-pointer transition-all"
                title="Account & Facility Profile"
                aria-label="User Profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                  OP
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-label-md text-xs text-on-surface font-semibold leading-tight">{t.plantOps}</span>
                  <span className="font-body-md text-[10px] text-on-surface-variant">{t.weighbridgeAdmin}</span>
                </div>
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-base font-bold shrink-0">
                      OP
                    </div>
                    <div className="leading-tight flex-1 truncate">
                      <p className="font-bold text-sm text-slate-900 truncate">{selectedFacility.name}</p>
                      <p className="text-[11px] text-emerald-800 font-semibold">{t.authorizedRecyclerDesk}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                          CPCB TIER-1
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 truncate">
                          {selectedFacility.reg_no}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.location}</span>
                      <span className="font-semibold text-slate-700 truncate">{selectedFacility.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.scaleStatus}</span>
                      <span className="font-semibold text-emerald-700">{t.digitalCertified}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onRoleSwitch) onRoleSwitch();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>{t.signOut}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workdesk Content */}
        <main className="w-full pt-20 px-4 sm:px-6 pb-12 flex-1 max-w-7xl mx-auto space-y-6">
          {/* Top Overview Metrics Strip */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Incoming Lots */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">
                    {t.metricIncomingLots}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {filteredLots.length}
                    </span>
                    <span className="font-label-md text-xs text-primary font-semibold">
                      {t.active}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">move_to_inbox</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span className="flex items-center gap-1 text-primary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {t.urgentWithin10km}
                </span>
                <span>{t.activeClusters}</span>
              </div>
            </div>

            {/* Metric 2: Pending Quotes */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">
                    {t.pendingQuotes}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {metrics.pending_verification_count || 6}
                    </span>
                    <span className="font-label-md text-xs text-tertiary font-semibold">
                      {t.inBidding}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span>{t.avgResponse12m}</span>
                <span className="text-primary font-medium">{t.negotiationOpen}</span>
              </div>
            </div>

            {/* Metric 3: Scheduled Pickups / Settlements */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">
                    {t.todaysSettlements}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      ₹{((metrics.total_payout_settled_inr || 342000) / 1000).toFixed(0)}k
                    </span>
                    <span className="font-label-md text-xs text-secondary font-semibold">
                      {t.instant}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span>{t.directToAggregators}</span>
                <span className="text-primary font-semibold">{t.zeroCommission}</span>
              </div>
            </div>

            {/* Metric 4: Monthly Sourced Material */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">
                    {t.verifiedTonnage}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {metrics.total_verified_tonnage_mt || 42.8}
                    </span>
                    <span className="font-label-md text-xs text-on-surface-variant">/ 50 MT</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[22px]">scale</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex flex-col gap-1 border-t border-outline-variant/20">
                <div className="flex justify-between items-center text-on-surface-variant text-[10px]">
                  <span>{t.facilityQuota}</span>
                  <span className="font-bold text-primary">85.6%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85.6%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Confirmation Notice Banner if issued */}
          {confirmationNotice && (
            <div className="bg-emerald-600/10 border-2 border-emerald-600 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm sm:text-base">
                    {t.weighbridgeConfirmedTitle}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Cert ID: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{confirmationNotice.certificate_id}</strong> | Lot: {confirmationNotice.lot_ref} | Net: {confirmationNotice.verified_weight} kg | Payout: ₹{confirmationNotice.payout.toLocaleString('en-IN')} ({confirmationNotice.payment_mode})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedManifestData(confirmationNotice)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>{t.viewForm6Manifest}</span>
                </button>
                <button
                  onClick={() => setConfirmationNotice(null)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  {t.dismiss}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: INCOMING LOTS (CORE WORKFLOW) */}
          {activeTab === 'incoming-lots' && (
            <div className="space-y-6">
              {/* Filter Toolbar */}
              <section className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 border border-outline-variant/30">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-lg text-xs font-bold text-on-surface mr-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">filter_list</span>
                    {t.categoryFilterLabel}
                  </span>
                  {[
                    { id: 'ALL', label: t.allLotsWithCount(lots.length) },
                    { id: 'PCB', label: t.circuitBoards },
                    { id: 'CABLES', label: t.copperCables },
                    { id: 'BATTERIES', label: t.batteries }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[16px] mr-1.5">near_me</span>
                    <select
                      value={radiusFilter}
                      onChange={(e) => setRadiusFilter(e.target.value)}
                      className="bg-transparent text-xs text-on-surface font-medium outline-none cursor-pointer"
                    >
                      <option value="10">{t.within10km}</option>
                      <option value="5">{t.within5km}</option>
                      <option value="25">{t.within25km}</option>
                      <option value="ALL">{t.allDistances}</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Main Two-Column Workdesk Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Lots Queue (8 Columns) */}
                <div className="lg:col-span-8 space-y-4">
                  {filteredLots.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">inbox</span>
                      <p className="mt-2 text-sm font-semibold text-on-surface">
                        {t.noLotsFound}
                      </p>
                      <button
                        onClick={() => {
                          setCategoryFilter('ALL');
                          setRadiusFilter('ALL');
                        }}
                        className="mt-3 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer"
                      >
                        {t.resetFilters}
                      </button>
                    </div>
                  ) : (
                    filteredLots.map((lot) => {
                      const currentRate = rates[lot.id] || lot.suggested_rate;
                      const totalPayout = Math.round(currentRate * lot.net_weight_kg);
                      const fulfillment = fulfillments[lot.id] || 'van';

                      return (
                        <article
                          key={lot.id}
                          className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 border border-outline-variant/30 relative overflow-hidden"
                        >
                          {/* Accent Top Color Stripe */}
                          <div
                            className={`absolute top-0 left-0 right-0 h-1.5 ${
                              lot.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-primary'
                            }`}
                          ></div>

                          {/* Header Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                              {lot.isDealerPallet && (
                                <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 whitespace-nowrap shrink-0">
                                  <span className="material-symbols-outlined text-[13px]">warehouse</span>
                                  {t.dealerPallet}
                                </span>
                              )}
                              <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                                {lot.isDealerPallet
                                  ? (lot.priority_label?.replace(/Aggregator Bulk Pallet •\s*/i, '').trim() || t.certifiedInbound)
                                  : (lot.priority_label || 'Grade A')}
                              </span>
                              <span className="font-headline-md text-xs sm:text-base font-bold text-on-surface whitespace-nowrap shrink-0">
                                Lot #{lot.handover_ref}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-md text-[11px] sm:text-xs text-on-surface-variant font-medium whitespace-nowrap shrink-0 ml-auto">
                              <span className="material-symbols-outlined text-primary text-[14px] shrink-0">schedule</span>
                              <span className="whitespace-nowrap">
                                {lot.time_posted === 'Ready for Fleet Dispatch (Yard 04)' ? 'Ready for Dispatch' : lot.time_posted}
                              </span>
                            </div>
                          </div>

                          {/* Responsive Card Body: Side-by-Side on sm+, stacked on tiny */}
                          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            {/* Left Image Column */}
                            <div className="w-full sm:w-52 shrink-0 flex flex-col gap-2">
                              <div className="relative rounded-lg overflow-hidden bg-surface-container-high h-44 sm:h-auto sm:flex-1 min-h-[160px] flex items-center justify-center border border-outline-variant/20">
                                <img
                                  alt={lot.title}
                                  className="w-full h-full object-cover"
                                  src={lot.image_url || getCategoryFallbackImage(lot.category)}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = getCategoryFallbackImage(lot.category);
                                  }}
                                />
                                <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/90 backdrop-blur-md rounded px-2 py-1 flex items-center justify-between text-inverse-on-surface text-[10px]">
                                  <span className="flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-primary-fixed text-[14px]">psychology</span>
                                    AI Vision
                                  </span>
                                  <span className="font-bold text-primary-fixed whitespace-nowrap">
                                    {lot.ai_badge === '100% Calibrated Scale Certified' ? 'Scale Certified' : lot.ai_badge}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-surface-container-low rounded-md px-2 py-1 flex items-center justify-between text-on-surface-variant text-[11px]">
                                <span className="flex items-center gap-1 truncate mr-1">
                                  <span className="material-symbols-outlined text-primary text-[14px]">location_on</span>
                                  <span className="truncate">{lot.location_label}</span>
                                </span>
                                <span className="font-bold text-on-surface shrink-0">{lot.distance_km} km</span>
                              </div>
                            </div>

                            {/* Right Details Column */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                              <div>
                                <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-tight">
                                  {lot.title}
                                </h3>
                                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                                  {lot.subtitle}
                                </p>

                                {/* Collector Profile Card */}
                                <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between mt-2.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
                                      {((lot.collector_name || (lot.isDealerPallet ? 'Dilip Bhai' : 'Babu Rao')) + '').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-on-surface truncate">
                                          {lot.collector_name || (lot.isDealerPallet ? 'Dilip Bhai (Peenya Yard #04 Aggregator)' : 'Babu Rao (Collector)')}
                                        </span>
                                        <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                                      </div>
                                      <span className="text-[10px] text-on-surface-variant block truncate">
                                        {lot.collector_history || (lot.isDealerPallet ? 'CPCB Reg #KA-AGG-2024-118' : 'Verified Door-to-Door Picker')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm shrink-0">
                                    <span className="material-symbols-outlined text-amber-500 text-[13px]">star</span>
                                    <span className="text-xs font-bold text-on-surface">{lot.collector_rating || 4.8}</span>
                                  </div>
                                </div>

                                {/* 3-Metric Matrix */}
                                <div className="grid grid-cols-3 gap-1 bg-surface-container rounded-lg p-2 mt-2.5 text-center">
                                  <div className="border-r border-outline-variant/30">
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      {t.netWeight}
                                    </span>
                                    <p className="text-sm font-bold text-on-surface">
                                      {lot.net_weight_kg} <span className="text-[11px] font-normal text-on-surface-variant">kg</span>
                                    </p>
                                  </div>
                                  <div className="border-r border-outline-variant/30">
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      {t.collectorAsking}
                                    </span>
                                    <p className="text-sm font-bold text-on-surface">
                                      ₹{lot.collector_asking_rate} <span className="text-[11px] font-normal text-on-surface-variant">/kg</span>
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      {t.marketRange}
                                    </span>
                                    <p className="text-sm font-bold text-primary">
                                      ₹{lot.benchmark_min}–{lot.benchmark_max} <span className="text-[11px] font-normal text-on-surface-variant">/kg</span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Quotation Procurement Terminal */}
                              <div className="bg-surface-container-low rounded-xl p-3 space-y-2.5 border border-outline-variant/20">
                                {/* Fulfillment Switcher */}
                                <div className="flex items-center justify-between flex-wrap gap-1.5">
                                  <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary text-[16px]">calculate</span>
                                    {t.fulfillmentMode}
                                  </label>
                                  <div className="flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded-lg border border-outline-variant/30">
                                    <button
                                      onClick={() => handleFulfillmentToggle(lot.id, 'van')}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                        fulfillment === 'van'
                                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                          : 'text-on-surface-variant hover:text-on-surface'
                                      }`}
                                      type="button"
                                    >
                                      {t.vanPickup}
                                    </button>
                                    <button
                                      onClick={() => handleFulfillmentToggle(lot.id, 'dropoff')}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                        fulfillment === 'dropoff'
                                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                          : 'text-on-surface-variant hover:text-on-surface'
                                      }`}
                                      type="button"
                                    >
                                      {t.selfDropoff}
                                    </button>
                                  </div>
                                </div>

                                {/* Price Input & Binding Total Display */}
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                  <div className="relative w-full sm:w-1/2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">₹</span>
                                    <input
                                      type="number"
                                      value={currentRate}
                                      onChange={(e) => handleRateChange(lot.id, e.target.value)}
                                      className="w-full bg-surface-container-lowest text-on-surface font-bold text-base pl-7 pr-12 py-1.5 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary h-10"
                                      placeholder="0.00"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-medium">/ kg</span>
                                  </div>

                                  <div className="w-full sm:w-1/2 bg-surface-container-lowest rounded-lg h-10 px-3 flex items-center justify-between shadow-sm border border-outline-variant/30">
                                    <span className="text-xs text-on-surface-variant font-medium">
                                      {t.totalValue}
                                    </span>
                                    <span className="text-base font-bold text-primary font-mono">
                                      ₹{totalPayout.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={`grid gap-2 ${lot.isDealerPallet ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                                  {lot.isDealerPallet && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDispatchForm({
                                          vehicle_no: 'KA-04-E-2091',
                                          driver_name: 'Suresh M.',
                                          driver_phone: '+91 98450 12891',
                                          target_collector_hub: lot.location_label || 'Peenya Aggregation Yard (Yard 04)',
                                          vehicle_type: 'Van (3-Wheeler / Tata Ace)',
                                          capacity_kg: Math.max(800, Math.ceil(lot.net_weight_kg * 1.2))
                                        });
                                        setShowDispatchModal(true);
                                      }}
                                      className="h-10 text-xs font-bold rounded-lg bg-secondary/15 hover:bg-secondary/25 text-secondary flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                                      <span>{t.dispatchFleet}</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleSendCounterOffer(lot)}
                                    disabled={lot.status === 'OFFER_SENT' || lot.status === 'CONFIRMED'}
                                    className={`h-10 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                      lot.status === 'OFFER_SENT'
                                        ? 'bg-primary-fixed/50 text-on-primary-fixed-variant font-bold cursor-default'
                                        : 'bg-surface-container-highest hover:bg-surface-container-high text-on-surface active:scale-98'
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {lot.status === 'OFFER_SENT' ? 'done_all' : 'reply'}
                                    </span>
                                    {lot.status === 'OFFER_SENT'
                                      ? t.offerSent
                                      : t.counterOffer}
                                  </button>
                                  <button
                                    onClick={() => handleOpenWeighbridgeModal(lot)}
                                    className={`h-10 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer ${
                                      lot.status === 'CONFIRMED'
                                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                        : 'bg-primary hover:bg-primary-container text-on-primary'
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {lot.status === 'CONFIRMED' ? 'verified' : 'check_circle'}
                                    </span>
                                    {lot.status === 'CONFIRMED'
                                      ? t.viewCpcbCert
                                      : t.acceptAndWeighbridge}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer Checklist */}
                          <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant border-t border-outline-variant/20">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <span className="material-symbols-outlined text-[14px]">fact_check</span>
                                {t.digitalLogReady}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">tag</span>
                                {t.cpcbCode} #{lot.category_code}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                {t.scaleCalibrated}
                              </span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant">
                              {t.eprVerificationStandard}
                            </span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>

                {/* Right Column: Logistics & Audit Panel (4 Columns) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Today's Dispatch Line */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-3 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">route</span>
                        <h3 className="font-headline-md text-sm font-bold text-on-surface">
                          {t.todaysDispatchLine}
                        </h3>
                      </div>
                      <span className="bg-primary-fixed font-bold text-on-primary-fixed-variant text-[10px] px-2 py-0.5 rounded-full">
                        {t.scheduledCount}
                      </span>
                    </div>

                    {/* Schedule 1 */}
                    <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1 border-l-4 border-primary">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[16px]">local_shipping</span>
                          Van #KA-04-E-2091
                        </span>
                        <span className="text-[10px] font-bold text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded">
                          15:30 IST Target
                        </span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        <p><strong className="text-on-surface">{t.driver}</strong> Suresh M. (+91 98450 12891)</p>
                        <p><strong className="text-on-surface">{t.destination}</strong> Ramesh K. / Peenya Industrial</p>
                      </div>
                      <div className="mt-1 pt-1 flex items-center justify-between text-[10px] text-on-surface-variant border-t border-outline-variant/20">
                        <span className="text-primary font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">scale</span>
                          {t.calibratedScaleOnboard}
                        </span>
                        <span>Est. 18m transit</span>
                      </div>
                    </div>

                    {/* Schedule 2 */}
                    <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1 border-l-4 border-secondary">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[16px]">fire_truck</span>
                          Truck #KA-02-B-9912
                        </span>
                        <span className="text-[10px] font-semibold text-on-surface-variant">17:00 IST</span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        <p><strong className="text-on-surface">{t.driver}</strong> Anil Gowda (+91 94481 00214)</p>
                        <p><strong className="text-on-surface">{t.mission}</strong> Yeshwanthpur Scrap Aggregators</p>
                      </div>
                      <div className="mt-1 pt-1 flex items-center justify-between text-[10px] text-on-surface-variant border-t border-outline-variant/20">
                        <span>Payload: 1,200 kg</span>
                        <span className="text-secondary font-medium">Outer Ring Route</span>
                      </div>
                    </div>

                    {/* Settlement Mode Picker */}
                    <div className="bg-surface-container rounded-lg p-2.5 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block">
                        {t.settlementMethod}
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'CASH', label: t.cash },
                          { id: 'UPI', label: '📱 UPI' },
                          { id: 'BANK', label: t.bank }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSettlementMode(m.id)}
                            className={`py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                              settlementMode === m.id
                                ? 'bg-surface-container-lowest shadow-sm text-primary border border-primary/30'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-lowest'
                            }`}
                            type="button"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-on-surface-variant block text-center mt-1">
                        {t.paymentSignedOffScale}
                      </span>
                    </div>
                  </div>

                  {/* Traceability & Audit Verification */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-3 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        <h4 className="font-headline-md text-sm font-bold text-on-surface">
                          {t.traceabilityAudit}
                        </h4>
                      </div>
                      <span className="bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        {t.cpcbAuditReady}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📍</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">
                            {t.auditStep1Title}
                          </span>
                          <p className="text-[11px] text-on-surface-variant">
                            {t.auditStep1Desc}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">⚖️</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">
                            {t.auditStep2Title}
                          </span>
                          <p className="text-[11px] text-on-surface-variant">
                            {t.auditStep2Desc}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📷</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">
                            {t.auditStep3Title}
                          </span>
                          <p className="text-[11px] text-on-surface-variant">
                            {t.auditStep3Desc}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📄</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">
                            {t.auditStep4Title}
                          </span>
                          <p className="text-[11px] text-on-surface-variant">
                            {t.auditStep4Desc}
                          </p>
                        </div>
                      </li>
                    </ul>

                    <button
                      onClick={handleDownloadLedger}
                      className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      {t.downloadLedgerCsv}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE PICKUPS LOGISTICS */}
          {activeTab === 'active-pickups' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{t.activeFleetHeader}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.activeFleetSubtitle} ({selectedFacility.name})
                  </p>
                </div>
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>{t.dispatchNewVehicle}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fleetVehicles.map((v) => (
                  <div key={v.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">{t.vehicleNumber}{v.id}</h4>
                          <span className="text-[11px] text-on-surface-variant">{v.driver} ({v.phone})</span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {v.status === 'In Transit' ? t.statusInTransit : v.status === 'Loading at Yard' ? t.statusLoading : v.status === 'En Route to Facility' ? t.statusEnRoute : (v.status || t.statusDispatched)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">{t.destination}</span>
                        <strong className="text-on-surface truncate block">{v.dest}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">{t.currentPayload}</span>
                        <strong className="text-primary">{v.payload}</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
                      <span className="flex items-center gap-1 text-primary font-medium text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">scale</span>
                        {t.calibratedScaleOnboard || v.scale}
                      </span>
                      <span className="font-bold text-on-surface">{t.eta} {v.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATERIAL INVENTORY */}
          {activeTab === 'material-inventory' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{t.plantInventoryHeader}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.plantInventorySubtitle}
                  </p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary-fixed/50 px-3 py-1 rounded-full">
                  {t.totalStockBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { cat: currentLang === 'hi' ? 'प्रिंटेड सर्किट बोर्ड (ग्रेड A/B)' : currentLang === 'mr' ? 'प्रिंटेड सर्किट बोर्ड (ग्रेड A/B)' : 'Printed Circuit Boards (Grade A/B)', code: 'ITEW1-PCB', stock: '14.2 MT', bay: currentLang === 'hi' ? 'बे ०३-A' : currentLang === 'mr' ? 'बे ०३-A' : 'Bay 03-A', val: '₹1,06,50,000', icon: 'memory' },
                  { cat: currentLang === 'hi' ? 'टेलीकॉम तांबे के तार एवं केबल' : currentLang === 'mr' ? 'टेलिकॉम तांब्याची वायर व केबल' : 'Telecom Copper Wire & Cable', code: 'ITEW-CBL-CU', stock: '18.4 MT', bay: currentLang === 'hi' ? 'बे ०१-C' : currentLang === 'mr' ? 'बे ०१-C' : 'Bay 01-C', val: '₹75,44,000', icon: 'electrical_services' },
                  { cat: currentLang === 'hi' ? 'ली-आयन बैटरी मॉड्यूल' : currentLang === 'mr' ? 'ली-आयन बॅटरी मॉड्यूल' : 'Li-ion Battery Modules', code: 'BATT-LI-ION', stock: '6.8 MT', bay: currentLang === 'hi' ? 'खतरनाक वॉल्ट B' : currentLang === 'mr' ? 'धोकादायक वॉल्ट B' : 'Hazardous Vault B', val: '₹7,48,000', icon: 'battery_charging_full' },
                  { cat: currentLang === 'hi' ? 'सीआरटी एवं मॉनिटर डिस्प्ले ग्लास' : currentLang === 'mr' ? 'सीआरटी व मॉनिटर डिस्प्ले ग्लास' : 'CRT & Monitor Display Glass', code: 'ITEW2-DISP', stock: '2.1 MT', bay: currentLang === 'hi' ? 'बे ०४-D' : currentLang === 'mr' ? 'बे ०४-D' : 'Bay 04-D', val: '₹84,000', icon: 'tv' },
                  { cat: currentLang === 'hi' ? 'श्रेडेड एल्युमिनियम एवं लौह धातु फ्रेम' : currentLang === 'mr' ? 'श्रेडेड ॲल्युमिनियम व लोखंडी फ्रेम' : 'Shredded Aluminum & Ferrous Frames', code: 'FERR-MET-01', stock: '1.3 MT', bay: currentLang === 'hi' ? 'यार्ड साइलो २' : currentLang === 'mr' ? 'यार्ड सायलो २' : 'Yard Silo 2', val: '₹65,000', icon: 'precision_manufacturing' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded font-mono">
                        {item.code}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{item.cat}</h4>
                      <p className="text-xs text-on-surface-variant">{t.storageLocation} {item.bay}</p>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">{t.availableStock}</span>
                        <strong className="text-sm font-bold text-primary">{item.stock}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant block">{t.inventoryValuation}</span>
                        <strong className="text-xs font-bold text-on-surface">{item.val}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRICE ENGINE & QUOTES */}
          {activeTab === 'price-quotes' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
                <h3 className="text-lg font-bold text-on-surface">{t.priceEngineHeader}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {t.priceEngineSubtitle}
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/40 text-on-surface-variant uppercase text-[10px] font-bold">
                      <th className="pb-3">{t.materialCategoryCol}</th>
                      <th className="pb-3">{t.cpcbCodeCol}</th>
                      <th className="pb-3">{t.spotBenchmarkCol}</th>
                      <th className="pb-3">{t.minFloorRateCol}</th>
                      <th className="pb-3">{t.recyclerOfferCol}</th>
                      <th className="pb-3">{t.statusCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {procurementBands.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-bold text-on-surface">
                          {currentLang === 'hi'
                            ? (row.cat.includes('Circuit') ? 'हाई-ग्रेड पीसीबी मदरबोर्ड' : row.cat.includes('Copper') ? 'शुद्ध तांबा केबल स्क्रैप' : row.cat.includes('Battery') ? 'लिथियम-आयन बैटरी पैक' : row.cat.includes('Display') ? 'सीआरटी / एलईडी डिस्प्ले यूनिट्स' : 'मिश्रित प्लास्टिक एवं केसिंग')
                            : currentLang === 'mr'
                            ? (row.cat.includes('Circuit') ? 'हाय-ग्रेड पीसीबी मदरबोर्ड' : row.cat.includes('Copper') ? 'शुद्ध तांब्याची केबल स्क्रॅप' : row.cat.includes('Battery') ? 'लिथियम-आयन बॅटरी पॅक' : row.cat.includes('Display') ? 'सीआरटी / एलईडी डिस्प्ले युनिट्स' : 'मिश्रित प्लास्टिक व केसिंग्ज')
                            : row.cat}
                        </td>
                        <td className="py-3 font-mono text-on-surface-variant">{row.code}</td>
                        <td className="py-3 text-primary font-semibold">{row.spot}</td>
                        <td className="py-3 text-on-surface-variant font-mono">₹{row.floor}/kg</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-primary font-bold">₹</span>
                            <input
                              type="number"
                              value={row.offer}
                              onChange={(e) => handleOfferRateBandChange(idx, e.target.value)}
                              className="w-20 bg-surface-container-lowest border border-outline-variant/40 rounded px-2 py-1 font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                            />
                            <span className="text-on-surface-variant text-[11px]">/kg</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t.activeOffer}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Broadcast Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant/20 mt-3">
                  <div className="text-xs text-on-surface-variant">
                    {rateBroadcastBanner ? (
                      <span className="text-primary font-bold flex items-center gap-1 animate-in fade-in">
                        <span className="material-symbols-outlined text-[16px]">campaign</span>
                        {rateBroadcastBanner}
                      </span>
                    ) : (
                      <span>{t.broadcastAutoNotice}</span>
                    )}
                  </div>
                  <button
                    onClick={handleBroadcastRates}
                    disabled={isBroadcastingRates}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isBroadcastingRates ? 'animate-spin' : ''}`}>
                      {isBroadcastingRates ? 'sync' : 'cell_tower'}
                    </span>
                    <span>{isBroadcastingRates ? t.broadcastingBtn : t.broadcastRatesBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRACEABILITY & EPR REPORTS */}
          {activeTab === 'traceability-epr' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{t.cpcbRegistryHeader}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.cpcbRegistrySubtitle}
                  </p>
                </div>
                <button
                  onClick={handleDownloadLedger}
                  className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  {t.exportEprLedgerCsv}
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    cert: 'CPCB-EPR-2026-MH-994102',
                    lot: 'RL-2026-00479',
                    collector: currentLang === 'mr' ? 'दिलीप एस. (यार्ड मॅनेजर)' : currentLang === 'hi' ? 'दिलीप एस. (यार्ड प्रबंधक)' : 'Dilip S. (Yard Manager)',
                    material: currentLang === 'mr' ? 'तांब्याची केबल (जड धातू)' : currentLang === 'hi' ? 'कॉपर केबल्स (भारी धातु)' : 'Copper Cables (Heavy Metals)',
                    weight: '35.0 kg',
                    payout: '₹14,700',
                    mode: currentLang === 'mr' ? 'रोख' : currentLang === 'hi' ? 'नकद' : 'CASH',
                    date: '2026-09-05 11:20 IST',
                    hash: 'SHA256: 8f9b4c2...e41a'
                  },
                  {
                    cert: 'CPCB-EPR-2026-MH-994088',
                    lot: 'RL-2026-00475',
                    collector: currentLang === 'mr' ? 'रमेश के. (पिन्या ॲग्रिगेटर)' : currentLang === 'hi' ? 'रमेश के. (पीन्या एग्रीगेटर)' : 'Ramesh K. (Peenya Aggregator)',
                    material: currentLang === 'mr' ? 'हाय-ग्रेड पीसीबी मदरबोर्ड्स' : currentLang === 'hi' ? 'हाई-ग्रेड पीसीबी मदरबोर्ड' : 'High-Grade PCB Motherboards',
                    weight: '12.0 kg',
                    payout: '₹9,360',
                    mode: 'UPI',
                    date: '2026-09-05 09:45 IST',
                    hash: 'SHA256: 3a71f09...b11c'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">verified</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {item.cert}
                          </span>
                          <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-mono">
                            {item.hash}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface mt-0.5">
                          <strong>{item.material}</strong> • {item.weight} {currentLang === 'mr' ? 'कडून' : currentLang === 'hi' ? 'से प्राप्त' : 'from'} {item.collector}
                        </p>
                        <span className="text-[10px] text-on-surface-variant">
                          {t.settledVia} {item.payout} {currentLang === 'mr' ? 'द्वारे' : currentLang === 'hi' ? 'द्वारा' : 'via'} {item.mode} ({item.date})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedManifestData(item)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg shrink-0 cursor-pointer flex items-center gap-1 transition-colors border border-primary/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>{t.viewForm6ManifestLink}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FACILITY SETTINGS */}
          {activeTab === 'facility-settings' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
                <h3 className="text-lg font-bold text-on-surface">{t.facilitySettingsHeader}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {t.facilitySettingsSubtitle} ({selectedFacility.name})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
                  <h4 className="font-bold text-sm text-on-surface">{t.cpcbProfileTitle}</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">{t.regNumber}</span>
                      <strong className="text-primary font-mono">{selectedFacility.reg_no}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">{t.operatingTerritory}</span>
                      <strong>{selectedFacility.location}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">{t.authorizedCategories}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFacility.materials.map((m, idx) => (
                          <span key={idx} className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
                  <h4 className="font-bold text-sm text-on-surface">{t.metrologyCalibrationTitle}</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">{t.scaleCalibratedOn}</span>
                      <strong>2026-08-15 ({currentLang === 'mr' ? 'कायदेशीर मापनशास्त्र विभाग, महाराष्ट्र' : currentLang === 'hi' ? 'विधिक मापविज्ञान विभाग, महाराष्ट्र' : 'Legal Metrology Dept, MH'})</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">{t.nextRecalibrationDue}</span>
                      <strong className="text-emerald-700">2027-02-15 ({t.validBadge})</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">{t.weightTolerance}</span>
                      <strong>{t.standardToleranceDesc}</strong>
                    </div>
                  </div>

                  {/* Calibration Self-Test Action */}
                  <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
                    <button
                      onClick={handleRunCalibration}
                      disabled={isCalibrating}
                      className="h-9 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${isCalibrating ? 'animate-spin' : ''}`}>
                        {isCalibrating ? 'refresh' : 'tune'}
                      </span>
                      <span>{isCalibrating ? t.runningTestBtn : t.runSelfTestBtn}</span>
                    </button>
                    {calibrationResult && (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-800 dark:text-emerald-300 text-[11px] space-y-0.5 animate-in fade-in">
                        <div className="flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>{t.calibrationStatus} {calibrationResult.status} ({calibrationResult.timestamp})</span>
                        </div>
                        <p>{t.tareZeroBalance} {calibrationResult.tare_verified} | {t.variance} {calibrationResult.variance}</p>
                        <p className="text-[10px] opacity-80">{calibrationResult.inspector_cert}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Weighbridge Verification & CPCB Confirmation Modal */}
      {inspectLot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-primary tracking-wider">
                  {t.weighbridgeModalTitle}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface mt-0.5">{inspectLot.title}</h3>
                <span className="text-xs text-on-surface-variant font-mono">Ref: {inspectLot.handover_ref}</span>
              </div>
              <button
                onClick={() => setInspectLot(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {t.collectorOrigin}
                </span>
                <p className="font-bold text-xs sm:text-sm text-on-surface truncate">{inspectLot.collector_name}</p>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {t.assignedRecycler}
                </span>
                <p className="font-bold text-xs sm:text-sm text-primary truncate">{selectedFacility.name}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                {t.actualNetWeightInput}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weighbridgeInput}
                  onChange={(e) => setWeighbridgeInput(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-lowest border-2 border-primary rounded-xl font-bold text-lg text-on-surface focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-sm font-bold text-on-surface-variant">kg</span>
              </div>
              <span className="text-[10px] text-on-surface-variant mt-1 block">
                {t.statedCollectorWeight} {inspectLot.net_weight_kg} kg | {t.scaleVariance} ±
                {Math.abs((parseFloat(weighbridgeInput) || 0) - inspectLot.net_weight_kg).toFixed(1)} kg
              </span>

              {/* Anomaly Detection Banner for Variance > 15% */}
              {(() => {
                const enteredW = parseFloat(weighbridgeInput) || 0;
                const statedW = inspectLot.net_weight_kg || 1;
                const diffKg = Math.abs(enteredW - statedW);
                const variancePct = statedW > 0 ? (diffKg / statedW) * 100 : 0;
                if (variancePct > 15) {
                  return (
                    <div className="mt-2 p-3 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
                      <span className="material-symbols-outlined text-[20px] text-red-600 shrink-0">error</span>
                      <div className="space-y-0.5">
                        <p className="font-bold">🚨 CPCB Weight Variance Anomaly ({variancePct.toFixed(1)}% deviation)</p>
                        <p className="text-[11px] opacity-90 leading-tight">
                          {currentLang === 'mr'
                            ? `काट्यावरील वजन कलेक्टरच्या स्वयं-नोंदवलेल्या वजनापेक्षा १५% पेक्षा जास्त विचलित आहे (${statedW} किलो विरुद्ध ${enteredW} किलो). अंतिम EPR क्रेडिट मंजुरीपूर्वी पर्यवेक्षक तपासणी आवश्यक आहे.`
                            : currentLang === 'hi'
                            ? `कांटे का वजन कलेक्टर द्वारा दर्ज वजन से विधिक १५% सीमा से अधिक विचलित है (${statedW} किग्रा बनाम ${enteredW} किग्रा)। अंतिम EPR क्रेडिट अनुमोदन से पहले सुपरवाइज़र समीक्षा आवश्यक है।`
                            : `Scale weight deviates by more than the statutory ±15% threshold from collector self-claim (${statedW} kg vs ${enteredW} kg). Supervisor review and metrology recalibration required before final EPR credit sign-off.`}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">
                {t.settlementAmount} ({settlementMode}):
              </span>
              <span className="text-lg font-bold text-primary font-mono">
                ₹
                {Math.round(
                  (parseFloat(weighbridgeInput) || inspectLot.net_weight_kg) *
                    (rates[inspectLot.id] || inspectLot.suggested_rate)
                ).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>{t.dualSignoffCheckbox}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>{t.metrologyStandardCheckbox}</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => setInspectLot(null)}
                className="h-10 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmWeighbridge}
                disabled={isSubmittingConfirm}
                className="h-10 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>
                  {isSubmittingConfirm ? t.issuingCertificateBtn : t.issueCpcbCertificateBtn}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory CPCB Form-6 Manifest Modal */}
      <Form6ManifestModal
        isOpen={Boolean(selectedManifestData)}
        onClose={() => setSelectedManifestData(null)}
        certData={selectedManifestData}
      />

      {/* Admin Master Tools Portal Modal */}
      <AdminToolsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      {/* Dispatch New Vehicle Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">{t.dispatchModalTitle}</h3>
                  <p className="text-[11px] text-on-surface-variant">{t.dispatchModalSubtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-on-surface-variant font-bold block mb-1">{t.vehicleRegNumber}</label>
                <input
                  type="text"
                  placeholder="e.g. KA-04-E-8821"
                  required
                  value={dispatchForm.vehicle_no}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, vehicle_no: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-on-surface-variant font-bold block mb-1">{t.driverName}</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Gowda"
                    required
                    value={dispatchForm.driver_name}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, driver_name: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant font-bold block mb-1">{t.driverPhone}</label>
                  <input
                    type="tel"
                    placeholder="+91 98450 11223"
                    value={dispatchForm.driver_phone}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, driver_phone: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-on-surface-variant font-bold block mb-1">{t.targetHub}</label>
                <select
                  value={dispatchForm.target_collector_hub}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, target_collector_hub: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Peenya Aggregation Yard (Yard 04)">{currentLang === 'hi' ? 'पीन्या एकत्रीकरण यार्ड (यार्ड ०४)' : currentLang === 'mr' ? 'पिन्या एकत्रीकरण यार्ड (यार्ड ०४)' : 'Peenya Aggregation Yard (Yard 04)'}</option>
                  <option value="Yeshwanthpur Industrial Aggregators">{currentLang === 'hi' ? 'यशवंतपुर औद्योगिक एग्रीगेटर्स' : currentLang === 'mr' ? 'यशवंतपूर औद्योगिक ॲग्रिगेटर्स' : 'Yeshwanthpur Industrial Aggregators'}</option>
                  <option value="Dharavi Link Road Scrap Market">{currentLang === 'hi' ? 'धारावी लिंक रोड स्क्रैप मार्केट' : currentLang === 'mr' ? 'धारावी लिंक रोड स्क्रॅप मार्केट' : 'Dharavi Link Road Scrap Market'}</option>
                  <option value="Rajajinagar Industrial E-Waste Hub">{currentLang === 'hi' ? 'राजाजीनगर औद्योगिक ई-कचरा हब' : currentLang === 'mr' ? 'राजाजीनगर औद्योगिक ई-कचरा हब' : 'Rajajinagar Industrial E-Waste Hub'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-on-surface-variant font-bold block mb-1">{t.vehicleType}</label>
                  <select
                    value={dispatchForm.vehicle_type}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, vehicle_type: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Van (3-Wheeler / Tata Ace)">{currentLang === 'hi' ? 'वैन (टाटा ऐस / पियाजियो)' : currentLang === 'mr' ? 'व्हॅन (टाटा एस / पियाजिओ)' : 'Van (Tata Ace / Piaggio)'}</option>
                    <option value="Medium Commercial Truck">{currentLang === 'hi' ? 'मध्यम वाणिज्यिक ट्रक (१.५ टन)' : currentLang === 'mr' ? 'मध्यम व्यावसायिक ट्रक (१.५ टन)' : 'Medium Truck (1.5 MT)'}</option>
                    <option value="Heavy Electric Cargo">{currentLang === 'hi' ? 'हैवी इलेक्ट्रिक कार्गो' : currentLang === 'mr' ? 'हेवी इलेक्ट्रिक कार्गो' : 'Heavy Electric Cargo'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-on-surface-variant font-bold block mb-1">{t.payloadCapacity}</label>
                  <input
                    type="number"
                    value={dispatchForm.capacity_kg}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, capacity_kg: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center gap-2 text-primary font-medium text-[11px]">
                <span className="material-symbols-outlined text-[16px]">scale</span>
                <span>{t.certifiedScaleIncluded}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="h-10 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispatch}
                  className="h-10 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>{isSubmittingDispatch ? t.dispatchingBtn : t.confirmDispatchBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectNotification={(screen) => {
          if (screen === 'offers') setActiveTab('incoming-lots');
          if (screen === 'receipt') setActiveTab('active-pickups');
          if (screen === 'earnings') setActiveTab('traceability-epr');
        }}
      />

      {/* Floating Action Toast */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <span className="material-symbols-outlined text-primary-fixed text-[24px]">check_circle</span>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-inverse-on-surface">{actionToast.title}</h4>
            <p className="text-[11px] text-inverse-on-surface/80">{actionToast.message}</p>
          </div>
          <button
            onClick={() => setActionToast(null)}
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface cursor-pointer p-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
