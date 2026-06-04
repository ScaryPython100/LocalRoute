export const translations = {
  en: {
    langCode: 'en-US',
    name: 'English',
    ui: {
      startOrigin: 'Start / Origin',
      targetDestination: 'Target Destination',
      routingTo: 'Routing to',
      statusRoutingActive: 'ROUTING ACTIVE',
      startNavigation: '🚀 Start Navigation',
      stopNavigation: '🛑 Stop Navigation',
      youHaveArrived: 'You Have Arrived!',
      welcomeTo: 'Welcome to',
      limit: 'Limit',
      strictlyMonitored: 'Strictly Monitored',
      enterStart: '🔍 Enter Start Location...',
      enterDest: '🔍 Enter Destination...',
      noMatch: '❌ No match',
      initializingMaps: 'Initializing satellite maps...',
      status: 'Status:'
    },
    speech: {
      navInit: 'Navigation initialized. Proceed to the Main Entry Gate.',
      arrived: 'You have arrived at your destination.'
    },
    map: {
      mainGate: 'Main Gate',
      villa: 'Villa',
      mainSecurityEntrance: '🚪 Main Security Entrance',
      gateDesc: 'Community QR scan point. Speed control begins here.',
      gatedResidentVilla: 'Gated Resident Villa',
      selectedTarget: '🎯 Selected Delivery Target Destination'
    },
    routes: {
      villa_105: [
        "Enter through the Main Entry Gate check-post.",
        "Drive straight North up the main avenue spine road for 135 meters.",
        "At the T-junction (2nd Main Road), make a sharp right turn.",
        "Take the immediate left turn into the Villa 105 lane. The destination will be on your right."
      ],
      villa_149: [
        "Enter through the Main Entry Gate check-post.",
        "Proceed straight North on the main avenue for 110 meters.",
        "Turn right at the crossroad intersection heading East.",
        "Follow the lane for 40 meters. Villa 149 is at the corner doorstep on your left."
      ],
      villa_128: [
        "Enter through the Main Entry Gate check-post.",
        "Drive straight North along the entire length of the main avenue spine (250 meters).",
        "At the final northern crossroad, make a right turn.",
        "Proceed down the lane for 60 meters. Villa 128 is on your left hand side."
      ],
      villa_127: [
        "Enter through the Main Entry Gate check-post.",
        "Drive straight North along the main avenue spine to the very top (250 meters).",
        "Turn right at the top northern crossroad intersection.",
        "Villa 127 is located immediately on your left, just before Villa 128."
      ],
      fallback: [
        "Depart from {start}.",
        "Follow the highlighted navigation path along the community roads.",
        "Arrive at your destination: {end}."
      ]
    },
    eta: {
      driveWalk: "{drive} min drive / {walk} min walk"
    }
  },
  hi: {
    langCode: 'hi-IN',
    name: 'हिंदी',
    ui: {
      startOrigin: 'शुरुआत / मूल (Origin)',
      targetDestination: 'लक्ष्य स्थान (Destination)',
      routingTo: 'रास्ता दिखाया जा रहा है:',
      statusRoutingActive: 'नेविगेशन चालू है',
      startNavigation: '🚀 नेविगेशन शुरू करें',
      stopNavigation: '🛑 नेविगेशन रोकें',
      youHaveArrived: 'आप पहुँच गए हैं!',
      welcomeTo: 'स्वागत है',
      limit: 'गति सीमा',
      strictlyMonitored: 'कड़ी निगरानी',
      enterStart: '🔍 शुरुआती स्थान दर्ज करें...',
      enterDest: '🔍 मंजिल दर्ज करें...',
      noMatch: '❌ कोई परिणाम नहीं',
      initializingMaps: 'मैप लोड हो रहा है...',
      status: 'स्थिति:'
    },
    speech: {
      navInit: 'नेविगेशन शुरू हो गया है। मुख्य द्वार की ओर बढ़ें।',
      arrived: 'आप अपनी मंजिल पर पहुँच गए हैं।'
    },
    map: {
      mainGate: 'मुख्य द्वार',
      villa: 'विला',
      mainSecurityEntrance: '🚪 मुख्य सुरक्षा प्रवेश',
      gateDesc: 'क्यूआर स्कैन पॉइंट। गति सीमा यहाँ से लागू है।',
      gatedResidentVilla: 'निवासी विला',
      selectedTarget: '🎯 चुना हुआ वितरण स्थान'
    },
    routes: {
      villa_105: [
        "मुख्य प्रवेश द्वार चेक-पोस्ट से प्रवेश करें।",
        "मुख्य एवेन्यू रोड पर 135 मीटर सीधे उत्तर की ओर ड्राइव करें।",
        "टी-जंक्शन (दूसरी मुख्य सड़क) पर, एक तेज दाहिना मोड़ लें।",
        "विला 105 लेन में तुरंत बायां मोड़ लें। मंजिल आपके दाहिनी ओर होगी।"
      ],
      villa_149: [
        "मुख्य प्रवेश द्वार चेक-पोस्ट से प्रवेश करें।",
        "मुख्य एवेन्यू पर 110 मीटर सीधे उत्तर की ओर बढ़ें।",
        "चौराहे पर पूर्व की ओर दाहिनी ओर मुड़ें।",
        "40 मीटर तक लेन का पालन करें। विला 149 आपके बाईं ओर कोने पर है।"
      ],
      villa_128: [
        "मुख्य प्रवेश द्वार चेक-पोस्ट से प्रवेश करें।",
        "मुख्य एवेन्यू पर पूरी लंबाई (250 मीटर) सीधे उत्तर की ओर ड्राइव करें।",
        "अंतिम उत्तरी चौराहे पर, दाहिनी ओर मुड़ें।",
        "लेन में 60 मीटर नीचे बढ़ें। विला 128 आपके बाईं ओर है।"
      ],
      villa_127: [
        "मुख्य प्रवेश द्वार चेक-पोस्ट से प्रवेश करें।",
        "मुख्य एवेन्यू पर सबसे ऊपर (250 मीटर) सीधे उत्तर की ओर ड्राइव करें।",
        "शीर्ष उत्तरी चौराहे पर दाहिनी ओर मुड़ें।",
        "विला 127 तुरंत आपके बाईं ओर स्थित है, विला 128 से ठीक पहले।"
      ],
      fallback: [
        "{start} से प्रस्थान करें।",
        "सामुदायिक सड़कों के साथ हाइलाइट किए गए मार्ग का पालन करें।",
        "अपनी मंजिल पर पहुँचें: {end}।"
      ]
    },
    eta: {
      driveWalk: "{drive} मिनट ड्राइव / {walk} मिनट पैदल"
    }
  },
  te: {
    langCode: 'te-IN',
    name: 'తెలుగు',
    ui: {
      startOrigin: 'ప్రారంభం / మూలం',
      targetDestination: 'గమ్యస్థానం',
      routingTo: 'మార్గం చూపుతోంది:',
      statusRoutingActive: 'నావిగేషన్ చురుకుగా ఉంది',
      startNavigation: '🚀 నావిగేషన్ ప్రారంభించండి',
      stopNavigation: '🛑 నావిగేషన్ ఆపండి',
      youHaveArrived: 'మీరు చేరుకున్నారు!',
      welcomeTo: 'స్వాగతం',
      limit: 'వేగ పరిమితి',
      strictlyMonitored: 'ఖచ్చితంగా పర్యవేక్షించబడుతుంది',
      enterStart: '🔍 ప్రారంభ స్థానం నమోదు చేయండి...',
      enterDest: '🔍 గమ్యస్థానం నమోదు చేయండి...',
      noMatch: '❌ సరిపోలిక లేదు',
      initializingMaps: 'మ్యాప్‌లను ప్రారంభిస్తోంది...',
      status: 'స్థితి:'
    },
    speech: {
      navInit: 'నావిగేషన్ ప్రారంభించబడింది. ప్రధాన గేటు వైపు వెళ్ళండి.',
      arrived: 'మీరు మీ గమ్యస్థానానికి చేరుకున్నారు.'
    },
    map: {
      mainGate: 'ప్రధాన గేటు',
      villa: 'విల్లా',
      mainSecurityEntrance: '🚪 ప్రధాన భద్రతా ప్రవేశం',
      gateDesc: 'క్యూఆర్ స్కాన్ పాయింట్. వేగ నియంత్రణ ఇక్కడ ప్రారంభమవుతుంది.',
      gatedResidentVilla: 'నివాస విల్లా',
      selectedTarget: '🎯 ఎంచుకున్న గమ్యస్థానం'
    },
    routes: {
      villa_105: [
        "ప్రధాన ప్రవేశ గేట్ చెక్-పోస్ట్ ద్వారా ప్రవేశించండి.",
        "ప్రధాన అవెన్యూ రోడ్డులో 135 మీటర్లు నేరుగా ఉత్తరం వైపు వెళ్ళండి.",
        "టీ-జంక్షన్ (రెండవ ప్రధాన రహదారి) వద్ద, కుడివైపుకు తిరగండి.",
        "విల్లా 105 లేన్‌లోకి తక్షణమే ఎడమవైపుకు తిరగండి. గమ్యస్థానం మీ కుడివైపున ఉంటుంది."
      ],
      villa_149: [
        "ప్రధాన ప్రవేశ గేట్ చెక్-పోస్ట్ ద్వారా ప్రవేశించండి.",
        "ప్రధాన అవెన్యూలో 110 మీటర్లు నేరుగా ఉత్తరం వైపు వెళ్ళండి.",
        "క్రాస్‌రోడ్ కూడలి వద్ద తూర్పు వైపుగా కుడివైపుకు తిరగండి.",
        "లేన్ గుండా 40 మీటర్లు వెళ్ళండి. విల్లా 149 మీ ఎడమ వైపు మూలలో ఉంది."
      ],
      villa_128: [
        "ప్రధాన ప్రవేశ గేట్ చెక్-పోస్ట్ ద్వారా ప్రవేశించండి.",
        "ప్రధాన అవెన్యూ వెంబడి (250 మీటర్లు) నేరుగా ఉత్తరం వైపు వెళ్ళండి.",
        "చివరి ఉత్తర క్రాస్‌రోడ్ వద్ద, కుడివైపుకు తిరగండి.",
        "లేన్ గుండా 60 మీటర్లు ముందుకు సాగండి. విల్లా 128 మీ ఎడమ వైపున ఉంది."
      ],
      villa_127: [
        "ప్రధాన ప్రవేశ గేట్ చెక్-పోస్ట్ ద్వారా ప్రవేశించండి.",
        "ప్రధాన అవెన్యూ వెంబడి పైభాగానికి (250 మీటర్లు) నేరుగా ఉత్తరం వైపు వెళ్ళండి.",
        "పైనున్న ఉత్తర క్రాస్‌రోడ్ కూడలి వద్ద కుడివైపుకు తిరగండి.",
        "విల్లా 127 తక్షణమే మీ ఎడమ వైపున ఉంది, విల్లా 128కి కొద్దిగా ముందు."
      ],
      fallback: [
        "{start} నుండి బయలుదేరండి.",
        "హైలైట్ చేయబడిన నావిగేషన్ మార్గాన్ని అనుసరించండి.",
        "మీ గమ్యస్థానానికి చేరుకోండి: {end}."
      ]
    },
    eta: {
      driveWalk: "{drive} నిమిషాల డ్రైవ్ / {walk} నిమిషాల నడక"
    }
  },
  kn: {
    langCode: 'kn-IN',
    name: 'ಕನ್ನಡ',
    ui: {
      startOrigin: 'ಪ್ರಾರಂಭ / ಮೂಲ',
      targetDestination: 'ಗುರಿ ಸ್ಥಳ',
      routingTo: 'ಮಾರ್ಗ ತೋರಿಸಲಾಗುತ್ತಿದೆ:',
      statusRoutingActive: 'ನ್ಯಾವಿಗೇಶನ್ ಸಕ್ರಿಯವಾಗಿದೆ',
      startNavigation: '🚀 ನ್ಯಾವಿಗೇಶನ್ ಪ್ರಾರಂಭಿಸಿ',
      stopNavigation: '🛑 ನ್ಯಾವಿಗೇಶನ್ ನಿಲ್ಲಿಸಿ',
      youHaveArrived: 'ನೀವು ತಲುಪಿದ್ದೀರಿ!',
      welcomeTo: 'ಸ್ವಾಗತ',
      limit: 'ವೇಗದ ಮಿತಿ',
      strictlyMonitored: 'ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ',
      enterStart: '🔍 ಪ್ರಾರಂಭ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ...',
      enterDest: '🔍 ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ...',
      noMatch: '❌ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ',
      initializingMaps: 'ನಕ್ಷೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      status: 'ಸ್ಥಿತಿ:'
    },
    speech: {
      navInit: 'ನ್ಯಾವಿಗೇಶನ್ ಪ್ರಾರಂಭವಾಗಿದೆ. ಮುಖ್ಯ ಗೇಟ್ ಕಡೆಗೆ ಮುಂದುವರಿಯಿರಿ.',
      arrived: 'ನೀವು ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನವನ್ನು ತಲುಪಿದ್ದೀರಿ.'
    },
    map: {
      mainGate: 'ಮುಖ್ಯ ಗೇಟ್',
      villa: 'ವಿಲ್ಲಾ',
      mainSecurityEntrance: '🚪 ಮುಖ್ಯ ಭದ್ರತಾ ಪ್ರವೇಶ',
      gateDesc: 'ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಪಾಯಿಂಟ್. ವೇಗದ ನಿಯಂತ್ರಣ ಇಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
      gatedResidentVilla: 'ವಸತಿ ವಿಲ್ಲಾ',
      selectedTarget: '🎯 ಆಯ್ಕೆಮಾಡಿದ ಗಮ್ಯಸ್ಥಾನ'
    },
    routes: {
      villa_105: [
        "ಮುಖ್ಯ ಪ್ರವೇಶ ಗೇಟ್ ಚೆಕ್-ಪೋస్ట్ ಮೂಲಕ ಪ್ರವೇಶಿಸಿ.",
        "ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ 135 ಮೀಟರ್ ನೇರವಾಗಿ ಉತ್ತರದ ಕಡೆಗೆ ಚಾಲನೆ ಮಾಡಿ.",
        "ಟಿ-ಜಂಕ್ಷನ್ (ಎರಡನೇ ಮುಖ್ಯ ರಸ್ತೆ) ಬಳಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ.",
        "ವಿಲ್ಲಾ 105 ಲೇನ್‌ಗೆ ತಕ್ಷಣ ಎಡಕ್ಕೆ ತಿರುಗಿ. ಗಮ್ಯಸ್ಥಾನವು ನಿಮ್ಮ ಬಲಭಾಗದಲ್ಲಿರುತ್ತದೆ."
      ],
      villa_149: [
        "ಮುಖ್ಯ ಪ್ರವೇಶ ಗೇಟ್ ಚೆಕ್-ಪೋಸ್ಟ್ ಮೂಲಕ ಪ್ರವೇಶಿಸಿ.",
        "ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ 110 ಮೀಟರ್ ನೇರವಾಗಿ ಉತ್ತರದ ಕಡೆಗೆ ಮುಂದುವರಿಯಿರಿ.",
        "ಕ್ರಾಸ್‌ರೋಡ್‌ನಲ್ಲಿ ಪೂರ್ವದ ಕಡೆಗೆ ಬಲಕ್ಕೆ ತಿರುಗಿ.",
        "ಲೇನ್‌ನಲ್ಲಿ 40 ಮೀಟರ್ ಹೋಗಿ. ವಿಲ್ಲಾ 149 ನಿಮ್ಮ ಎಡಭಾಗದ ಮೂಲೆಯಲ್ಲಿದೆ."
      ],
      villa_128: [
        "ಮುಖ್ಯ ಪ್ರವೇಶ ಗೇಟ್ ಚೆಕ್-ಪೋಸ್ಟ್ ಮೂಲಕ ಪ್ರವೇಶಿಸಿ.",
        "ಮುಖ್ಯ ರಸ್ತೆಯ ಉದ್ದಕ್ಕೂ (250 ಮೀಟರ್) ನೇರವಾಗಿ ಉತ್ತರದ ಕಡೆಗೆ ಚಾಲನೆ ಮಾಡಿ.",
        "ಕೊನೆಯ ಉತ್ತರದ ಕ್ರಾಸ್‌ರೋಡ್ ಬಳಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ.",
        "ಲೇನ್‌ನಲ್ಲಿ 60 ಮೀಟರ್ ಕೆಳಗೆ ಮುಂದುವರಿಯಿರಿ. ವಿಲ್ಲಾ 128 ನಿಮ್ಮ ಎಡಭಾಗದಲ್ಲಿದೆ."
      ],
      villa_127: [
        "ಮುಖ್ಯ ಪ್ರವೇಶ ಗೇಟ್ ಚೆಕ್-ಪೋಸ್ಟ್ ಮೂಲಕ ಪ್ರವೇಶಿಸಿ.",
        "ಮುಖ್ಯ ರಸ್ತೆಯ ಉದ್ದಕ್ಕೂ ಮೇಲಕ್ಕೆ (250 ಮೀಟರ್) ನೇರವಾಗಿ ಉತ್ತರದ ಕಡೆಗೆ ಚಾಲನೆ ಮಾಡಿ.",
        "ಮೇಲಿನ ಉತ್ತರದ ಕ್ರಾಸ್‌ರೋಡ್ ಬಳಿ ಬಲಕ್ಕೆ ತಿರುಗಿ.",
        "ವಿಲ್ಲಾ 127 ತಕ್ಷಣವೇ ನಿಮ್ಮ ಎಡಭಾಗದಲ್ಲಿದೆ, ವಿಲ್ಲಾ 128 ಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಮೊದಲು."
      ],
      fallback: [
        "{start} ನಿಂದ ಹೊರಡಿ.",
        "ಹೈಲೈಟ್ ಮಾಡಿದ ನ್ಯಾವಿಗೇಶನ್ ಮಾರ್ಗವನ್ನು ಅನುಸರಿಸಿ.",
        "ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನವನ್ನು ತಲುಪಿ: {end}."
      ]
    },
    eta: {
      driveWalk: "{drive} ನಿಮಿಷಗಳ ಡ್ರೈವ್ / {walk} ನಿಮಿಷಗಳ ನಡಿಗೆ"
    }
  },
  ta: {
    langCode: 'ta-IN',
    name: 'தமிழ்',
    ui: {
      startOrigin: 'தொடக்கம் / தோற்றம்',
      targetDestination: 'இலக்கு',
      routingTo: 'வழி காட்டப்படுகிறது:',
      statusRoutingActive: 'வழிகாட்டுதல் செயலில் உள்ளது',
      startNavigation: '🚀 வழிசெலுத்தலைத் தொடங்கு',
      stopNavigation: '🛑 வழிசெலுத்தலை நிறுத்து',
      youHaveArrived: 'நீங்கள் வந்துவிட்டீர்கள்!',
      welcomeTo: 'வரவேற்கிறோம்',
      limit: 'வேக வரம்பு',
      strictlyMonitored: 'கண்காணிக்கப்படுகிறது',
      enterStart: '🔍 தொடக்க இடத்தை உள்ளிடவும்...',
      enterDest: '🔍 இலக்கை உள்ளிடவும்...',
      noMatch: '❌ பொருத்தம் இல்லை',
      initializingMaps: 'வரைபடங்கள் ஏற்றப்படுகின்றன...',
      status: 'நிலை:'
    },
    speech: {
      navInit: 'வழிசெலுத்தல் தொடங்கப்பட்டது. பிரதான வாயிலை நோக்கிச் செல்லுங்கள்.',
      arrived: 'நீங்கள் உங்கள் இலக்கை அடைந்துவிட்டீர்கள்.'
    },
    map: {
      mainGate: 'பிரதான வாயில்',
      villa: 'வில்லா',
      mainSecurityEntrance: '🚪 பிரதான பாதுகாப்பு நுழைவாயில்',
      gateDesc: 'QR ஸ்கேன் பாயிண்ட். வேகக் கட்டுப்பாடு இங்கு தொடங்குகிறது.',
      gatedResidentVilla: 'குடியிருப்பு வில்லா',
      selectedTarget: '🎯 தேர்ந்தெடுக்கப்பட்ட இலக்கு'
    },
    routes: {
      villa_105: [
        "பிரதான நுழைவாயில் செக்-போஸ்ட் வழியாக நுழையவும்.",
        "பிரதான சாலையில் வடக்கு நோக்கி 135 மீட்டர் நேராகச் செல்லவும்.",
        "டி-சந்திப்பில் (இரண்டாவது பிரதான சாலை), வலதுபுறம் திரும்பவும்.",
        "உடனடியாக வில்லா 105 லேனில் இடதுபுறம் திரும்பவும். இலக்கு உங்கள் வலதுபுறம் இருக்கும்."
      ],
      villa_149: [
        "பிரதான நுழைவாயில் செக்-போஸ்ட் வழியாக நுழையவும்.",
        "பிரதான சாலையில் வடக்கு நோக்கி 110 மீட்டர் நேராகச் செல்லவும்.",
        "குறுக்கு வழியில் கிழக்கு நோக்கி வலதுபுறம் திரும்பவும்.",
        "லேனில் 40 மீட்டர் செல்லவும். வில்லா 149 உங்கள் இடதுபுறம் மூலையில் உள்ளது."
      ],
      villa_128: [
        "பிரதான நுழைவாயில் செக்-போஸ்ட் வழியாக நுழையவும்.",
        "பிரதான சாலையில் வடக்கு நோக்கி 250 மீட்டர் நேராகச் செல்லவும்.",
        "கடைசி வடக்கு குறுக்கு வழியில், வலதுபுறம் திரும்பவும்.",
        "லேனில் 60 மீட்டர் செல்லவும். வில்லா 128 உங்கள் இடதுபுறம் உள்ளது."
      ],
      villa_127: [
        "பிரதான நுழைவாயில் செக்-போஸ்ட் வழியாக நுழையவும்.",
        "பிரதான சாலையில் வடக்கு நோக்கி 250 மீட்டர் நேராகச் செல்லவும்.",
        "மேல் வடக்கு குறுக்கு வழியில் வலதுபுறம் திரும்பவும்.",
        "வில்லா 127 உடனடியாக உங்கள் இடதுபுறம் உள்ளது, வில்லா 128 க்கு சற்று முன்பு."
      ],
      fallback: [
        "{start} லிருந்து புறப்படவும்.",
        "முன்னிலைப்படுத்தப்பட்ட வழிசெலுத்தல் பாதையைப் பின்பற்றவும்.",
        "உங்கள் இலக்கை அடையுங்கள்: {end}."
      ]
    },
    eta: {
      driveWalk: "{drive} நிமிட ஓட்டுதல் / {walk} நிமிட நடை"
    }
  }
};
