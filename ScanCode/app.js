const productData = [
    {barcode: "6920339021481", name: "宏源果汁硬糖巧克力橙味+百香果味288g", spec: "24", order: "1"},
    {barcode: "6920339021474", name: "宏源果汁硬糖沙田柚味+百香果味288g", spec: "24", order: "2"},
    {barcode: "6920339017880", name: "宏源陈皮糖288g", spec: "30", order: "3"},
    {barcode: "6920339019860", name: "宏源话梅糖288g", spec: "30", order: "4"},
    {barcode: "6972318512725", name: "津华谷色苦荞片葱香味400g", spec: "10", order: "5"},
    {barcode: "6972318510073", name: "津华谷色苦荞片西冷牛排味400g", spec: "10", order: "6"},
    {barcode: "6924790600711", name: "爱尚咪咪虾味360g", spec: "24", order: "7"},
    {barcode: "6924790600209", name: "爱尚咪咪蟹味360g", spec: "24", order: "8"},
    {barcode: "6914782131484", name: "徐福记新年糖308g", spec: "20", order: "9"},
    {barcode: "6955304523578", name: "山楂宝贝六物山楂丸130g", spec: "36", order: "10"},
    {barcode: "6955304520140", name: "山楂宝贝山楂球150g", spec: "36", order: "11"},
    {barcode: "6955304521345", name: "山楂宝贝山楂果180g", spec: "20", order: "12"},
    {barcode: "6955304521581", name: "山楂宝贝陈皮山楂球130g", spec: "36", order: "13"},
    {barcode: "6955304520119", name: "山楂宝贝山楂卷180g", spec: "36", order: "14"},
    {barcode: "6955304520102", name: "山楂宝贝山楂条180g", spec: "36", order: "15"},
    {barcode: "6955304520188", name: "山楂宝贝山楂片150g", spec: "36", order: "16"},
    {barcode: "6955304520256", name: "山楂宝贝山楂片300g", spec: "20", order: "17"},
    {barcode: "6955304520133", name: "山楂宝贝山楂条360g", spec: "20", order: "18"},
    {barcode: "6955304520287", name: "山楂宝贝果丹皮360g", spec: "20", order: "19"},
    {barcode: "6955304520225", name: "山楂宝贝山楂糕300g", spec: "20", order: "20"},
    {barcode: "6974093810041", name: "鲜到无蔗糖全麦吐司500g", spec: "10", order: "21"},
    {barcode: "6974093811727", name: "鲜到红豆吐司500g", spec: "10", order: "22"},
    {barcode: "6978620700676", name: "凯利来阿克苏红枣蛋糕350g", spec: "16", order: "23"},
    {barcode: "6974114512541", name: "凯利来黄油面包320g", spec: "16", order: "24"},
    {barcode: "6926273300026", name: "美吉果天日盐味小圆饼100g", spec: "30", order: "25"},
    {barcode: "6926273300019", name: "美吉果南乳味小圆饼100g", spec: "30", order: "26"},
    {barcode: "6940188803588", name: "甘源原味青豆75克", spec: "50", order: "27"},
    {barcode: "6940188804066", name: "甘源蒜香青豆75克", spec: "50", order: "28"},
    {barcode: "6940188803595", name: "甘源蟹黄蚕豆75克", spec: "50", order: "29"},
    {barcode: "6940188803618", name: "甘源蟹黄瓜子75克", spec: "50", order: "30"},
    {barcode: "6920339019518", name: "宏源258克葡萄味仔仔棒糖", spec: "30", order: "31"},
    {barcode: "6920339019501", name: "宏源258克草莓味仔仔棒糖", spec: "30", order: "32"},
    {barcode: "6940188801522", name: "甘源原味青豆138克", spec: "30", order: "33"},
    {barcode: "6940188802468", name: "甘源蒜香味青豌豆138克", spec: "30", order: "34"},
    {barcode: "6940188803755", name: "甘源蟹黄瓜子138克", spec: "30", order: "35"},
    {barcode: "6940188803748", name: "甘源蟹黄味蚕豆138克", spec: "30", order: "36"},
    {barcode: "6955304522793", name: "山楂宝贝蓝莓山楂棒80g", spec: "30", order: "37"},
    {barcode: "6955304522809", name: "山楂宝贝桑葚山楂棒80g", spec: "30", order: "38"},
    {barcode: "6955304522786", name: "山楂宝贝原味山楂棒80g", spec: "30", order: "39"},
    {barcode: "6940188804677", name: "甘源蟹黄瓜子285克", spec: "20", order: "40"},
    {barcode: "6940188801034", name: "甘源原味青豌豆285克", spec: "20", order: "41"},
    {barcode: "6940188805186", name: "甘源285克蒜香青豌豆", spec: "20", order: "42"},
    {barcode: "6940188801515", name: "甘源蟹黄蚕豆285克", spec: "20", order: "43"},
    {barcode: "6943986069729", name: "金箭240克酸甜梅肉", spec: "40", order: "44"},
    {barcode: "6943986086085", name: "金箭味觉韩式乌酸梅180g", spec: "40", order: "45"},
    {barcode: "6943986069668", name: "金箭味觉韩式半梅180克", spec: "40", order: "46"},
    {barcode: "6943986069682", name: "金箭味觉韩式话梅120克", spec: "40", order: "47"},
    {barcode: "6943986010479", name: "金箭牛肉粒台式五香味100g", spec: "24", order: "48"},
    {barcode: "6943986010004", name: "金箭牛肉粒台式香辣味100g", spec: "24", order: "49"},
    {barcode: "6943986074525", name: "金箭80克牛肉粒五香味", spec: "30", order: "50"},
    {barcode: "6943986074501", name: "金箭牛肉粒沙嗲味80g", spec: "30", order: "51"},
    {barcode: "6943986074518", name: "金箭牛肉粒香辣味80g", spec: "30", order: "52"},
    {barcode: "6943986083282", name: "金箭80克鱼皮烧烤味", spec: "24", order: "53"},
    {barcode: "6943986083268", name: "金箭80克鱼皮香辣味", spec: "24", order: "54"},
    {barcode: "6943986083275", name: "金箭80克鱼皮香辣味", spec: "24", order: "55"},
    {barcode: "6943986075980", name: "金箭奶酪魔方308克牛奶味", spec: "24", order: "56"},
    {barcode: "6937638107525", name: "思宏蓝莓味山楂棒128克", spec: "30", order: "57"},
    {barcode: "6937638107495", name: "思宏原味山楂棒128克", spec: "30", order: "58"},
    {barcode: "6973057431971", name: "光明纯至布朗尼脆片巧克力味60g", spec: "36", order: "59"},
    {barcode: "6973057431988", name: "光明纯至布朗尼脆片生椰拿铁味60g", spec: "36", order: "60"},
    {barcode: "6974114513081", name: "凯利来蜜麻花蜜糖味400g", spec: "12", order: "61"},
    {barcode: "6974114513074", name: "凯利来山药麻花400g", spec: "12", order: "62"},
    {barcode: "6974114513098", name: "凯利来酥麻花椒盐味400g", spec: "12", order: "63"},
    {barcode: "6926768534882", name: "美丹不添加蔗糖白苏打饼干鲜葱味450g", spec: "12", order: "64"},
    {barcode: "6926768534875", name: "美丹不添加蔗糖白苏打饼干芝麻味450g", spec: "12", order: "65"},
    {barcode: "6956927100924", name: "翔誉木糖醇油栗仁200g", spec: "24", order: "66"},
    {barcode: "6956927100993", name: "翔誉油栗仁200g", spec: "24", order: "67"},
    {barcode: "6978620700645", name: "凯利来净简蛋酥沙琪玛450g", spec: "12", order: "68"},
    {barcode: "6978620700652", name: "凯利来妙可蓝多联名黄油沙琪玛410g", spec: "12", order: "69"},
    {barcode: "6914782225626", name: "徐福记宫廷酥心糖420g", spec: "8", order: "70"},
    {barcode: "6914782234703", name: "徐福记酥心糖混合口味桶装橙色款520g", spec: "12", order: "71"},
    {barcode: "6914782131453", name: "徐福记新年糖420g", spec: "12", order: "72"},
    {barcode: "6914782217980", name: "徐福记新年糖礼盒420g", spec: "8", order: "73"},
    {barcode: "6914782131378", name: "徐福记酥心糖306g", spec: "20", order: "74"},
    {barcode: "6914782131385", name: "徐福记拉丝牛轧糖210g", spec: "20", order: "75"},
    {barcode: "6914782126749", name: "徐福记花生酥250g", spec: "20", order: "76"},
    {barcode: "6937638108577", name: "思宏黑芝麻糯枣200克", spec: "20", order: "77"},
    {barcode: "6937638106672", name: "思宏黑芝麻丸200g", spec: "20", order: "78"},
    {barcode: "6955773918592", name: "凯利来无添加蔗糖沙琪玛458g", spec: "10", order: "79"},
    {barcode: "6974114513067", name: "凯利来无添加蔗糖沙琪玛山药味408g", spec: "16", order: "80"},
    {barcode: "6974114510530", name: "凯利来坚果沙琪玛黑糖味408g", spec: "16", order: "81"},
    {barcode: "6976357040393", name: "丽云沙琪玛600g", spec: "10", order: "82"},
    {barcode: "6976357040294", name: "丽云每日坚果沙琪玛360g", spec: "16", order: "83"},
    {barcode: "6937638102124", name: "思宏香酥灰枣252g", spec: "25", order: "84"},
    {barcode: "6937638105095", name: "思宏新疆灰枣500g", spec: "18", order: "85"},
    {barcode: "6937638101455", name: "思宏枣夹核桃仁252g", spec: "15", order: "86"},
    {barcode: "6959269901204", name: "柏味园干烙蛋堡奶香味360g", spec: "20", order: "87"},
    {barcode: "6959269901211", name: "柏味园干烙蛋堡蛋香味360g", spec: "20", order: "88"},
    {barcode: "6928137560096", name: "北方绿人450克动物饼干", spec: "15", order: "89"},
    {barcode: "6932842013037", name: "北方绿人早餐饼干420g", spec: "18", order: "90"},
    {barcode: "6928137569174", name: "北方绿人猴菇早餐饼干420g", spec: "18", order: "91"},
    {barcode: "6928137569365", name: "北方绿人爆米花焦糖味450克", spec: "10", order: "92"},
    {barcode: "6928137569372", name: "北方绿人爆米花奶油味450克", spec: "10", order: "93"},
    {barcode: "6971306583518", name: "马大姐北京酥300g", spec: "20", order: "94"},
    {barcode: "6971306583525", name: "马大姐老北京大虾酥糖300g", spec: "30", order: "95"},
    {barcode: "6971306583501", name: "马大姐花生牛轧糖227g", spec: "36", order: "96"},
    {barcode: "6940935201407", name: "腾飞荣达甘草杏180g", spec: "20", order: "97"},
    {barcode: "6940935200264", name: "腾飞荣达甘草野杏肉180g", spec: "20", order: "98"},
    {barcode: "6953614291637", name: "明西龙岩花生白玉咸干500g", spec: "20", order: "99"},
    {barcode: "6953614290517", name: "明西龙岩花生气蒸蒜蓉味500g", spec: "20", order: "100"},
    {barcode: "6953614252102", name: "龙岩湿烤花生500克", spec: "20", order: "101"},
    {barcode: "6927849460595", name: "好巴食豆干五香95G", spec: "30", order: "102"},
    {barcode: "6927849460571", name: "好巴食豆干麻辣95G", spec: "30", order: "103"},
    {barcode: "6927849460601", name: "好巴食豆干烧烤95G", spec: "30", order: "104"},
    {barcode: "6927849460588", name: "好巴食豆干泡椒味95G", spec: "30", order: "105"},
    {barcode: "6927849464982", name: "好巴食经典豆干超值混装实惠包302g", spec: "10", order: "106"},
    {barcode: "6927849413249", name: "好巴食乐香麦320g", spec: "10", order: "107"},
    {barcode: "6927849413225", name: "好巴食乐香米320g", spec: "10", order: "108"},
    {barcode: "6927849413263", name: "好巴食青稞麦320g", spec: "10", order: "109"},
    {barcode: "6927849413287", name: "好巴食小米通320g", spec: "10", order: "110"},
    {barcode: "6972318510905", name: "津华谷色丑锅巴川香麻辣味400g", spec: "12", order: "111"},
    {barcode: "6972318513784", name: "津华谷色丑锅巴酱汁牛排味400g", spec: "12", order: "112"},
    {barcode: "6914782214767", name: "徐福记沙琪玛香酥蛋黄味469g", spec: "12", order: "113"},
    {barcode: "6914782203617", name: "徐福记沙琪玛香酥鸡蛋味469g", spec: "12", order: "114"},
    {barcode: "6914782082434", name: "徐福记鸡蛋香酥沙琪玛160g促销装", spec: "20", order: "115"},
    {barcode: "6914782209046", name: "徐福记沙琪玛蛋酥味416g", spec: "12", order: "116"},
    {barcode: "6914782223462", name: "雀巢美禄夹心饼干经典巧克力味108g", spec: "12", order: "117"},
    {barcode: "6914782225794", name: "雀巢美禄夹心饼干浓香牛奶味108g", spec: "12", order: "118"},
    {barcode: "6914782203334", name: "徐福记草莓酥182g", spec: "20", order: "119"},
    {barcode: "6914782203327", name: "徐福记凤梨酥182g", spec: "20", order: "120"},
    {barcode: "6914782214712", name: "徐福记凤梨酥减糖184g", spec: "20", order: "121"},
    {barcode: "6914782202504", name: "徐福记100夹心米果卷香烤牛排90G", spec: "20", order: "122"},
    {barcode: "6914782202498", name: "徐福记100夹心米果卷玉米味90G", spec: "20", order: "123"},
    {barcode: "6914782202511", name: "徐福记100夹心米果卷咸香之士90G", spec: "20", order: "124"},
    {barcode: "6914782116672", name: "熊博士果汁大棒糖142g", spec: "12", order: "125"},
    {barcode: "6914782203594", name: "徐福记沙琪玛香酥芝麻味469g", spec: "12", order: "126"},
    {barcode: "6914782082441", name: "徐福记香酥芝麻味沙琪玛160g促销装", spec: "20", order: "127"},
    {barcode: "6940935201735", name: "腾飞荣达蒜香花生228g", spec: "35", order: "128"},
    {barcode: "6940935200363", name: "腾飞荣达咸味花生228g", spec: "35", order: "129"},
    {barcode: "6940935201131", name: "腾飞开心果100克", spec: "30", order: "130"},
    {barcode: "6940935201209", name: "腾飞荣达烤鱼片68g", spec: "30", order: "131"},
    {barcode: "6940935201155", name: "腾飞荣达盐焗腰果150g", spec: "30", order: "132"},
    {barcode: "6940935200684", name: "腾飞荣达香蕉片108g", spec: "30", order: "133"},
    {barcode: "6940935200660", name: "腾飞荣达葡萄干150g", spec: "30", order: "134"},
    {barcode: "6940935200080", name: "腾飞山楂片180克", spec: "30", order: "135"},
    {barcode: "6920130971107", name: "雪海梅乡绿葡萄干165g", spec: "20", order: "136"},
    {barcode: "6920130973507", name: "雪海梅乡混合水果干105g", spec: "20", order: "137"},
    {barcode: "6971989160440", name: "雪海梅乡综合蔬果脆80g", spec: "20", order: "138"},
    {barcode: "6920130972913", name: "雪海梅乡芒果条105g", spec: "20", order: "139"},
    {barcode: "6920130966233", name: "雪海梅乡盐津桃肉180g", spec: "12", order: "140"},
    {barcode: "6920130968824", name: "雪海梅乡韩话梅200g", spec: "12", order: "141"},
    {barcode: "6920130967889", name: "雪海梅乡西梅140g", spec: "12", order: "142"},
    {barcode: "6920130966240", name: "雪海梅乡冰花杨梅180g", spec: "12", order: "143"},
    {barcode: "6920130971879", name: "雪海梅乡草莓干66g", spec: "30", order: "144"},
    {barcode: "6920130971893", name: "雪海梅乡芒果干66g", spec: "30", order: "145"},
    {barcode: "6920130971909", name: "雪海梅乡柠檬片58g", spec: "30", order: "146"},
    {barcode: "6920130971886", name: "雪海梅乡黄桃干66g", spec: "30", order: "147"},
    {barcode: "6971989160334", name: "雪海梅乡奶酪冻干草莓28g", spec: "30", order: "148"},
    {barcode: "6971989160327", name: "雪海梅乡奶酪冻干榴莲21g", spec: "30", order: "149"},
    {barcode: "6971989160303", name: "雪海梅乡奶酪混合冻干水果28g", spec: "30", order: "150"},
    {barcode: "6920130966301", name: "雪海梅乡盐津葡萄220g", spec: "12", order: "151"},
    {barcode: "6920130966288", name: "雪海梅乡台式话梅120g", spec: "12", order: "152"},
    {barcode: "6971989162680", name: "雪海梅乡古韵罐装系列金桔", spec: "12", order: "153"},
    {barcode: "6920130973163", name: "雪海梅乡乌酸梅200克", spec: "12", order: "154"},
    {barcode: "6920130967711", name: "雪海梅乡珍珠梅230克", spec: "12", order: "155"},
    {barcode: "6973482400092", name: "沙发猫炭秘烤肠原味72g", spec: "20", order: "156"},
    {barcode: "6973482400108", name: "沙发猫奥尔良风味脆骨肠72g", spec: "20", order: "157"},
    {barcode: "6973482400146", name: "沙发猫奥尔良风味炭烤小鸡腿（鸡翅根）", spec: "20", order: "158"},
    {barcode: "6973482401228", name: "沙发猫盐焗味鹌鹑蛋72g", spec: "20", order: "159"},
    {barcode: "6973482401174", name: "沙发猫海苔肉松卷65g", spec: "20", order: "160"},
    {barcode: "6973482401259", name: "沙发猫手撕肉干五香味65g", spec: "20", order: "161"},
    {barcode: "6973482400078", name: "沙发猫香烤猪肉脯65g", spec: "20", order: "162"},
    {barcode: "6973482400849", name: "沙发猫高蛋白肉脯80g", spec: "20", order: "163"},
    {barcode: "6973482400085", name: "沙发猫手撕猪肉脯芝麻味88g", spec: "20", order: "164"},
    {barcode: "6973482400061", name: "沙发猫卤香鹌鹑蛋105g", spec: "20", order: "165"},
    {barcode: "6973482400047", name: "沙发猫吮骨鸭脖香辣味80g", spec: "20", order: "166"},
    {barcode: "6973482400054", name: "沙发猫虎皮凤爪香辣味105g", spec: "20", order: "167"},
    {barcode: "6973482400221", name: "沙发猫芝麻夹心海苔26g", spec: "20", order: "168"},
    {barcode: "6973482400245", name: "沙发猫东南亚芒果干80g", spec: "20", order: "169"},
    {barcode: "6973482400269", name: "沙发猫黄桃干90g", spec: "20", order: "170"},
    {barcode: "6973482400252", name: "沙发猫草莓干80g", spec: "20", order: "171"},
    {barcode: "6973482400832", name: "沙发猫川香牛肉麻辣味80g", spec: "20", order: "172"},
    {barcode: "6973482400115", name: "沙发猫手撕蟹味棒香辣味75g", spec: "20", order: "173"},
    {barcode: "6973482400467", name: "沙发猫75克+赠30克手撕蟹味棒原味", spec: "20", order: "174"},
    {barcode: "6973482400504", name: "沙发猫卤香烤鸡蛋30g", spec: "240", order: "175"},
    {barcode: "6973482400214", name: "沙发猫海带结香辣味120g", spec: "30", order: "176"},
    {barcode: "6973482400672", name: "沙发猫去骨凤爪柠檬酸辣味70g", spec: "20", order: "177"},
    {barcode: "6973482400689", name: "沙发猫去骨鸭掌柠檬酸辣味68g", spec: "20", order: "178"},
    {barcode: "6973482400887", name: "沙发猫铁板鱿鱼65g", spec: "20", order: "179"},
    {barcode: "5973087400467", name: "沙发猫手撕蟹味棒原味75g", spec: "20", order: "180"},
    {barcode: "6973482400726", name: "沙发猫金钱猪肉脯原味80g", spec: "20", order: "181"},
    {barcode: "6973482400023", name: "沙发猫香卤牛肉42g", spec: "20", order: "182"},
    {barcode: "6973482400856", name: "沙发猫香酥小黄鱼原味42g", spec: "20", order: "183"},
    {barcode: "6973482401167", name: "沙发猫烤鸡胸肉香辣烧烤味60g", spec: "20", order: "184"},
    {barcode: "6973482400016", name: "沙发猫牛板筋烧烤味60g", spec: "20", order: "185"},
    {barcode: "6973482400030", name: "沙发猫爆汁牛肚藤椒味60g", spec: "20", order: "186"},
    {barcode: "6944978709944", name: "有友筋骨棒165g", spec: "40", order: "187"},
    {barcode: "6944978709340", name: "有友泡凤爪山椒味136g", spec: "40", order: "188"},
    {barcode: "6944978700842", name: "有友山椒猪皮晶90g", spec: "50", order: "189"},
    {barcode: "6922145800113", name: "有友山椒竹笋120g", spec: "40", order: "190"},
    {barcode: "6944978711855", name: "有友不油炸虎皮凤爪辣卤味115g", spec: "24", order: "191"},
    {barcode: "6944978711923", name: "有友不油炸虎皮凤爪香卤味115g", spec: "24", order: "192"},
    {barcode: "6944978701245", name: "有友山椒笋尖100g", spec: "40", order: "193"},
    {barcode: "6944978700859", name: "有友山椒猪皮晶60g", spec: "60", order: "194"},
    {barcode: "6928497820038", name: "品品逗嘴香泡凤爪清爽原味150g", spec: "25", order: "195"},
    {barcode: "6926273300224", name: "美吉果山椒笋尖220g", spec: "30", order: "196"},
    {barcode: "6926273311565", name: "美吉果山椒笋尖90g", spec: "60", order: "197"},
    {barcode: "6928497822025", name: "品品泡椒凤爪200g", spec: "30", order: "198"},
    {barcode: "6926768537098", name: "美丹苏打饼干芹菜味248克", spec: "24", order: "199"},
    {barcode: "6926768530785", name: "美丹苏打饼干鲜葱味248克", spec: "24", order: "200"},
    {barcode: "6926768530778", name: "美丹苏打饼干芝麻味248克", spec: "24", order: "201"},
    {barcode: "6926768530792", name: "美丹苏打饼干原味248克", spec: "24", order: "202"},
    {barcode: "6926768537326", name: "美丹苏打饼干燕麦味248克", spec: "24", order: "203"},
    {barcode: "6928497834813", name: "品品吃货研究院220g原味鸡拐", spec: "30", order: "204"},
    {barcode: "6928497833922", name: "品品逗嘴香泡凤爪青柠味150g", spec: "25", order: "205"},
    {barcode: "6928497888526", name: "品品牛板筋烧烤味85g", spec: "40", order: "206"},
    {barcode: "6928497888519", name: "品品牛板筋香辣味85g", spec: "40", order: "207"},
    {barcode: "6928497810015", name: "品品牛板筋麻辣味108g", spec: "30", order: "208"},
    {barcode: "6928497810039", name: "品品牛板筋烧烤味108g", spec: "30", order: "209"},
    {barcode: "6937221716172", name: "贤哥名嘴1哥小小脆58g", spec: "50", order: "210"},
    {barcode: "6937221708818", name: "贤哥山椒肥肠味面筋130g", spec: "40", order: "211"},
    {barcode: "6937221708825", name: "贤哥面筋铁板烧牛肉味130g", spec: "40", order: "212"},
    {barcode: "6937221708801", name: "贤哥深井烧鹅味面筋130g", spec: "40", order: "213"},
    {barcode: "6937221716189", name: "贤哥面筋香片素牛肉101g", spec: "40", order: "214"},
    {barcode: "6937221716127", name: "贤哥面筋棒棒素鸡筋101g", spec: "40", order: "215"},
    {barcode: "6937221703387", name: "贤哥素牛筋香辣味115g", spec: "40", order: "216"},
    {barcode: "6937221706487", name: "贤哥素牛筋115g", spec: "40", order: "217"},
    {barcode: "6937221704490", name: "贤哥盐焗素板筋108g", spec: "40", order: "218"},
    {barcode: "6937221704322", name: "贤哥150g手撕羊排味", spec: "40", order: "219"},
    {barcode: "6937221704339", name: "贤哥150g手撕牛排味", spec: "40", order: "220"},
    {barcode: "6937221704346", name: "贤哥面筋手撕鸡肉味150g", spec: "40", order: "221"},
    {barcode: "6959836921437", name: "贤哥牛肉味素肉串90克", spec: "50", order: "222"},
    {barcode: "6959836921413", name: "贤哥香辣素肉串90克", spec: "50", order: "223"},
    {barcode: "6937690354080", name: "蒙都厚切卤牛肉原味42g", spec: "40", order: "224"},
    {barcode: "6937693354097", name: "蒙都厚切卤牛肉香辣味42g", spec: "40", order: "225"},
    {barcode: "6937690360876", name: "蒙都风干牛肉原味92g", spec: "30", order: "226"},
    {barcode: "6937690360883", name: "蒙都风干牛肉香辣味92g", spec: "30", order: "227"},
    {barcode: "6937690354011", name: "蒙都手撕牛肉香辣味40g", spec: "30", order: "228"},
    {barcode: "6937690354004", name: "蒙都手撕牛肉原味40g", spec: "30", order: "229"},
    {barcode: "6937690354882", name: "蒙都风干牛肉藤椒味40g", spec: "30", order: "230"},
    {barcode: "6937690359030", name: "蒙都风干牛肉香辣味40g", spec: "30", order: "231"},
    {barcode: "6937690354899", name: "蒙都风干牛肉原味40g", spec: "30", order: "232"},
    {barcode: "6937690359184", name: "蒙都超风干牛肉原味32g", spec: "30", order: "233"},
    {barcode: "6937690359191", name: "蒙都超风干牛肉香辣味32g", spec: "30", order: "234"},
    {barcode: "6937690353540", name: "蒙都条形牛板筋香烤味30g", spec: "200", order: "235"},
    {barcode: "6937690353533", name: "蒙都条形牛板筋香辣味30g", spec: "200", order: "236"},
    {barcode: "6971955590028", name: "醇牛坊素牛筋烧烤味158克", spec: "70", order: "237"},
    {barcode: "6971955590011", name: "醇牛坊素牛筋香辣味158克", spec: "70", order: "238"},
    {barcode: "6971955590202", name: "醇牛坊大辣片180克", spec: "70", order: "239"},
    {barcode: "6937638107310", name: "思宏夏威夷果500g", spec: "12", order: "240"},
    {barcode: "6944978701252", name: "有友红油笋尖100g", spec: "40", order: "241"},
    {barcode: "6925556700973", name: "百里鲜炭烤鱼片60g", spec: "70", order: "242"},
    {barcode: "6925556701048", name: "百里鲜鳕鱼片70g", spec: "70", order: "243"},
    {barcode: "6925556700416", name: "百里鲜烤鱼片60g", spec: "70", order: "244"},
    {barcode: "6925556700102", name: "百里鲜深海鳕鱼片88g", spec: "70", order: "245"},
    {barcode: "6944978703133", name: "有友猪皮晶香辣味90g", spec: "50", order: "246"},
    {barcode: "6940935201896", name: "腾飞荣达碳烤鱿鱼丝70g", spec: "20", order: "247"},
    {barcode: "6914782203600", name: "徐福记香酥鸡蛋味469G", spec: "12", order: "248"},
    {barcode: "6926273310520", name: "美吉果芒果干115g", spec: "30", order: "249"},
    {barcode: "6937221709785", name: "贤哥山椒笋尖70g", spec: "30", order: "250"},
    {barcode: "6926768537333", name: "美丹蔬菜饼干248克", spec: "30", order: "251"},
    {barcode: "6926273320512", name: "美吉果拌饭海苔120克", spec: "30", order: "252"},
    {barcode: "6937638105644", name: "思宏手剥烤核桃草本味418g", spec: "30", order: "253"},
    {barcode: "6955304520201", name: "山楂宝贝山楂球300g", spec: "20", order: "254"},
    {barcode: "6914782225824", name: "徐福记全家福糖点福乐礼礼箱783g", spec: "4", order: "255"},
    {barcode: "6914782225848", name: "徐福记全家福糖点福瑞礼礼箱1.116kg", spec: "4", order: "256"},
    {barcode: "6937638105682", name: "思宏手剥烤核桃蜂蜜红枣味418g", spec: "30", order: "257"}
];

let scannedResults = [];
let html5QrCode = null;
let isCameraRunning = false;
let currentProduct = null;
let db = null;
let editingId = null;

let isSwiping = false;
let touchStartX = 0;
let touchCurrentX = 0;
let activeRow = null;
let lastTouchTime = 0;
let lastTouchRowId = null;

const DB_NAME = 'ScanCodeDB';
const DB_VERSION = 1;
const STORE_NAME = 'results';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            loadResultsFromDB();
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('barcode', 'barcode', { unique: false });
            }
        };
    });
}

function saveToDB(result) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(result);
        
        request.onsuccess = () => {
            result.id = request.result;
            resolve(result);
        };
        
        request.onerror = () => {
            console.error('Error saving to DB:', request.error);
            reject(request.error);
        };
    });
}

function updateInDB(result) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.put(result);
        
        request.onsuccess = () => {
            resolve(result);
        };
        
        request.onerror = () => {
            console.error('Error updating in DB:', request.error);
            reject(request.error);
        };
    });
}

function deleteFromDB(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);
        
        request.onsuccess = () => {
            resolve();
        };
        
        request.onerror = () => {
            console.error('Error deleting from DB:', request.error);
            reject(request.error);
        };
    });
}

function loadResultsFromDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();
        
        request.onsuccess = () => {
            scannedResults = request.result.sort((a, b) => a.scanOrder - b.scanOrder);
            updateResultsTable();
            updateStatusBar();
            resolve(scannedResults);
        };
        
        request.onerror = () => {
            console.error('Error loading from DB:', request.error);
            reject(request.error);
        };
    });
}

function clearDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();
        
        request.onsuccess = () => {
            resolve();
        };
        
        request.onerror = () => {
            console.error('Error clearing DB:', request.error);
            reject(request.error);
        };
    });
}

window.onload = function() {
    initDB().catch(err => {
        console.error('Failed to initialize database:', err);
        showNotification('数据库初始化失败', 'error');
    });
};

function searchByBarcode() {
    const barcode = document.getElementById('barcodeInput').value.trim();
    if (!barcode) {
        showNotification('请输入商品条码', 'error');
        return;
    }
    
    const product = productData.find(p => p.barcode === barcode);
    if (product) {
        showQuantityModal(product);
        document.getElementById('barcodeInput').value = '';
    } else {
        showNotification('未找到该条码对应的商品', 'error');
    }
}

async function addResult(product, boxCount = 0, bagCount = 0, total = 1) {
    const result = {
        ...product,
        boxCount: boxCount,
        bagCount: bagCount,
        total: total,
        scanOrder: scannedResults.length + 1
    };
    
    try {
        if (editingId !== null) {
            result.id = editingId;
            result.scanOrder = scannedResults.find(r => r.id === editingId).scanOrder;
            await updateInDB(result);
            const index = scannedResults.findIndex(r => r.id === editingId);
            if (index !== -1) {
                scannedResults[index] = result;
            }
            editingId = null;
        } else {
            await saveToDB(result);
            scannedResults.push(result);
        }
        updateResultsTable();
        updateStatusBar();
    } catch (error) {
        console.error('Error saving result:', error);
        showNotification('保存失败', 'error');
    }
}

function updateResultsTable() {
    const tbody = document.getElementById('resultsBody');
    const emptyState = document.getElementById('emptyState');
    
    if (scannedResults.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    tbody.innerHTML = scannedResults.map((result, index) => `
        <tr data-id="${result.id}">
            <td style="text-align: right;">${index + 1}</td>
            <td style="text-align: center;">${result.barcode.slice(-4)}</td>
            <td>${result.name}</td>
            <td style="text-align: center;">${result.spec}</td>
            <td style="text-align: right;">${result.boxCount}</td>
            <td style="text-align: right;">${result.bagCount}</td>
            <td style="text-align: right;">${result.total}</td>
        </tr>
    `).join('');
    
    setupTableInteractions();
}

function updateStatusBar() {
    document.getElementById('totalCount').textContent = scannedResults.length;
    if (scannedResults.length > 0) {
        const lastResult = scannedResults[scannedResults.length - 1];
        document.getElementById('lastScan').textContent = lastResult.name;
    } else {
        document.getElementById('lastScan').textContent = '-';
    }
}

async function clearResults() {
    if (!confirm('确定要清空所有结果吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        await clearDB();
        scannedResults = [];
        updateResultsTable();
        updateStatusBar();
        showNotification('已清空所有结果');
    } catch (error) {
        console.error('Error clearing results:', error);
        showNotification('清空失败', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.classList.add('show');
    
    if (navigator.vibrate && type === 'success') {
        navigator.vibrate(50);
    } else if (navigator.vibrate && type === 'error') {
        navigator.vibrate([50, 50, 50]);
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

async function startCamera() {
    if (isCameraRunning) {
        showNotification('摄像头已在运行中', 'error');
        return;
    }

    try {
        document.getElementById('cameraContainer').classList.add('active');
        
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            onScanSuccess,
            onScanFailure
        );
        
        isCameraRunning = true;
        showNotification('摄像头已开启');
    } catch (err) {
        console.error(err);
        showNotification('无法开启摄像头: ' + err.message, 'error');
        document.getElementById('cameraContainer').classList.remove('active');
    }
}

async function stopCamera() {
    if (!isCameraRunning || !html5QrCode) {
        return;
    }

    try {
        await html5QrCode.stop();
        html5QrCode.clear();
        isCameraRunning = false;
        document.getElementById('cameraContainer').classList.remove('active');
    } catch (err) {
        console.error(err);
    }
}

function onScanSuccess(decodedText, decodedResult) {
    const product = productData.find(p => p.barcode === decodedText);
    if (product) {
        showQuantityModal(product);
        stopCamera();
    } else {
        showNotification(`未找到条码: ${decodedText}`, 'error');
    }
}

function onScanFailure(error) {
}

function showQuantityModal(product) {
    editingId = null;
    currentProduct = product;
    document.getElementById('modalTitle').textContent = '商品盘点';
    document.getElementById('modalBarcode').textContent = product.barcode;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductSpec').textContent = product.spec;
    document.getElementById('boxCount').value = '';
    document.getElementById('bagCount').value = '';
    document.getElementById('totalQuantity').textContent = '0';
    document.getElementById('quantityModal').classList.add('active');
    setTimeout(() => {
        const focusInput = document.getElementById('focusInputSelect').value;
        document.getElementById(focusInput === 'box' ? 'boxCount' : 'bagCount').focus();
    }, 100);
}

function calculateTotal() {
    const boxCount = parseInt(document.getElementById('boxCount').value) || 0;
    const bagCount = parseInt(document.getElementById('bagCount').value) || 0;
    const spec = parseInt(currentProduct.spec) || 0;
    const total = boxCount * spec + bagCount;
    document.getElementById('totalQuantity').textContent = total;
}

function handleBoxCountKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('bagCount').focus();
    }
}

function handleBagCountKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmQuantity();
    }
}

function cancelModal() {
    document.getElementById('quantityModal').classList.remove('active');
    currentProduct = null;
    editingId = null;
}

async function confirmQuantity() {
    const boxCount = parseInt(document.getElementById('boxCount').value) || 0;
    const bagCount = parseInt(document.getElementById('bagCount').value) || 0;
    const spec = parseInt(currentProduct.spec) || 0;
    const total = boxCount * spec + bagCount;
    
    if (total === 0) {
        showNotification('请输入数量', 'error');
        return;
    }
    
    await addResult(currentProduct, boxCount, bagCount, total);
    document.getElementById('quantityModal').classList.remove('active');
    const message = editingId !== null 
        ? `已更新: ${currentProduct.name}，总数量 ${total}`
        : `已添加: ${currentProduct.name}，总数量 ${total}`;
    showNotification(message);
    currentProduct = null;
}

async function editResult(id) {
    const result = scannedResults.find(r => r.id === id);
    if (!result) {
        showNotification('未找到该记录', 'error');
        return;
    }
    
    editingId = id;
    currentProduct = {
        barcode: result.barcode,
        name: result.name,
        spec: result.spec,
        order: result.order
    };
    
    document.getElementById('modalTitle').textContent = '编辑商品';
    document.getElementById('modalBarcode').textContent = result.barcode;
    document.getElementById('modalProductName').textContent = result.name;
    document.getElementById('modalProductSpec').textContent = result.spec;
    document.getElementById('boxCount').value = result.boxCount;
    document.getElementById('bagCount').value = result.bagCount;
    document.getElementById('totalQuantity').textContent = result.total;
    document.getElementById('quantityModal').classList.add('active');
    setTimeout(() => {
        const focusInput = document.getElementById('focusInputSelect').value;
        document.getElementById(focusInput === 'box' ? 'boxCount' : 'bagCount').focus();
    }, 100);
}

async function deleteResult(id) {
    if (!confirm('确定要删除这条记录吗？')) {
        return;
    }
    
    try {
        await deleteFromDB(id);
        scannedResults = scannedResults.filter(r => r.id !== id);
        updateResultsTable();
        updateStatusBar();
        showNotification('已删除记录');
    } catch (error) {
        console.error('Error deleting result:', error);
        showNotification('删除失败', 'error');
    }
}

function handleRowMouseDown(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.clientX;
    touchCurrentX = e.clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}

function handleRowMouseMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}

async function handleRowMouseUp(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            activeRow.style.transform = 'translateX(0)';
            await editResult(rowId);
        } else if (diffX > 40) {
            activeRow.style.transform = 'translateX(0)';
            await deleteResult(rowId);
        }
    } else {
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

function handleRowMouseLeave(e) {
    if (!isSwiping || !activeRow) return;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';
    activeRow.style.transform = 'translateX(0)';
    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

function handleRowTouchStart(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.touches[0].clientX;
    touchCurrentX = e.touches[0].clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}

function handleRowTouchMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}

async function handleRowTouchEnd(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);
    const currentTime = new Date().getTime();

    if (Math.abs(diffX) < 10 && currentTime - lastTouchTime < 300 && lastTouchRowId === rowId) {
        activeRow.style.transform = 'translateX(0)';
        activeRow.classList.remove('swipe-green');
        activeRow.classList.remove('swipe-red');
        
        isSwiping = false;
        activeRow = null;
        
        setTimeout(() => {
            editResult(rowId);
        }, 50);
        return;
    }

    lastTouchTime = currentTime;
    lastTouchRowId = rowId;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            activeRow.style.transform = 'translateX(0)';
            await editResult(rowId);
        } else if (diffX > 40) {
            activeRow.style.transform = 'translateX(0)';
            await deleteResult(rowId);
        }
    } else {
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

function handleRowTouchCancel(e) {
    if (!isSwiping || !activeRow) return;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';
    activeRow.style.transform = 'translateX(0)';
    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

function setupTableInteractions() {
    const tbody = document.getElementById('resultsBody');
    
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('mousedown', handleRowMouseDown);
        row.addEventListener('mousemove', handleRowMouseMove);
        row.addEventListener('mouseup', handleRowMouseUp);
        row.addEventListener('mouseleave', handleRowMouseLeave);
        row.addEventListener('touchstart', handleRowTouchStart, { passive: true });
        row.addEventListener('touchmove', handleRowTouchMove, { passive: false });
        row.addEventListener('touchend', handleRowTouchEnd);
        row.addEventListener('touchcancel', handleRowTouchCancel);
    });
}

function showSuggestions(text) {
    text = text.trim();
    
    if (!text) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return;
    }
    
    const filtered = productData.filter(product => 
        product.name.toLowerCase().includes(text.toLowerCase()) || 
        product.barcode.includes(text)
    );
    
    if (filtered.length === 0) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return;
    }
    
    const suggestionsHTML = filtered.map(product => `
        <div class="search-suggestion-item" data-barcode="${product.barcode}">
            <span style="color: #667eea; font-weight: bold;">${product.barcode.slice(-4)}</span>
            <span style="margin-left: 10px;">${product.name}</span>
        </div>
    `).join('');
    
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.style.display = 'block';
    
    document.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const barcode = item.dataset.barcode;
            const product = productData.find(p => p.barcode === barcode);
            if (product) {
                showQuantityModal(product);
                document.getElementById('barcodeInput').value = '';
                document.getElementById('searchSuggestions').style.display = 'none';
            }
        });
    });
}

function exportToCSV() {
    if (scannedResults.length === 0) {
        showNotification('没有数据可导出', 'error');
        return;
    }
    
    const headers = ['序号', '商品条码', '商品名称', '规格', '箱数', '袋数', '总数量'];
    const rows = scannedResults.map((result, index) => [
        index + 1,
        result.barcode,
        result.name,
        result.spec,
        result.boxCount,
        result.bagCount,
        result.total
    ]);
    
    let csvContent = '\uFEFF';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `扫描结果_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('导出成功');
}

function copyToClipboard() {
    if (scannedResults.length === 0) {
        showNotification('没有数据可复制', 'error');
        return;
    }
    
    let clipboardContent = '';
    
    scannedResults.forEach((result, index) => {
        let quantityText = '';
        if (result.boxCount > 0 && result.bagCount > 0) {
            quantityText = `${result.boxCount}箱${result.bagCount}袋`;
        } else if (result.boxCount > 0) {
            quantityText = `${result.boxCount}箱`;
        } else if (result.bagCount > 0) {
            quantityText = `${result.bagCount}袋`;
        } else {
            quantityText = '0';
        }
        
        const line = `${result.barcode} ${result.name}*${result.spec} ${quantityText} ${result.total}`;
        clipboardContent += line + '\n';
    });
    
    navigator.clipboard.writeText(clipboardContent.trim())
        .then(() => {
            showNotification('已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败', 'error');
        });
}

document.getElementById('barcodeInput').addEventListener('input', function(e) {
    showSuggestions(e.target.value);
});

document.addEventListener('click', function(e) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const inputElement = document.getElementById('barcodeInput');
    if (!suggestionsContainer.contains(e.target) && e.target !== inputElement) {
        suggestionsContainer.style.display = 'none';
    }
});