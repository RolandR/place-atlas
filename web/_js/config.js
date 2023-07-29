// This script only applies to this instance of the Atlas.
// Please also check code indicated with "@instanceonly" outside this file.
// TODO: Avoid having instance-only code inside the main scripts to make updating easier.

const prodDomain = "2017.place-atlas.stefanocoding.me"
window.prodDomain = prodDomain

const instanceId = "2017"
window.instanceId = instanceId

const instanceSubreddit = "placeAtlas"
window.instanceSubreddit = instanceSubreddit

const pageTitle = "The 2017 r/place Atlas"
window.pageTitle = pageTitle

const canvasSize = {
	x: 1000,
	y: 1000
}
window.canvasSize = canvasSize

const canvasOffset = {
	x: 0,
	y: 0
}
window.canvasOffset = canvasOffset

const canvasCenter = {
	x: canvasSize.x/2 + canvasOffset.x,
	y: canvasSize.y/2 + canvasOffset.y
}
window.canvasCenter = canvasCenter

const variationsConfig = {
	default: {
		name: "r/place",
		code: "",
		default: 144,
		drawablePeriods: [0, 144],
		versions: [
			{ "timestamp": 1490918688, "url": [ "./_img/canvas/place30/1490918688-0.png" ] },
			{ "timestamp": 1490981400, "url": [ "./_img/canvas/place30/1490918688-0.png", "./_img/canvas/place30/1490981400-17706_1490918688-0.png" ] },
			{ "timestamp": 1490983200, "url": [ "./_img/canvas/place30/1490986800-158021.png", "./_img/canvas/place30/1490983200-47742_1490986800-158021.png" ] },
			{ "timestamp": 1490985000, "url": [ "./_img/canvas/place30/1490986800-158021.png", "./_img/canvas/place30/1490985000-92473_1490986800-158021.png" ] },
			{ "timestamp": 1490986800, "url": [ "./_img/canvas/place30/1490986800-158021.png" ] },
			{ "timestamp": 1490988600, "url": [ "./_img/canvas/place30/1490986800-158021.png", "./_img/canvas/place30/1490988600-237912_1490986800-158021.png" ] },
			{ "timestamp": 1490990400, "url": [ "./_img/canvas/place30/1490986800-158021.png", "./_img/canvas/place30/1490990400-328483_1490986800-158021.png" ] },
			{ "timestamp": 1490992200, "url": [ "./_img/canvas/place30/1490995800-616507.png", "./_img/canvas/place30/1490992200-426373_1490995800-616507.png" ] },
			{ "timestamp": 1490994000, "url": [ "./_img/canvas/place30/1490995800-616507.png", "./_img/canvas/place30/1490994000-531200_1490995800-616507.png" ] },
			{ "timestamp": 1490995800, "url": [ "./_img/canvas/place30/1490995800-616507.png" ] },
			{ "timestamp": 1490997600, "url": [ "./_img/canvas/place30/1490995800-616507.png", "./_img/canvas/place30/1490997600-681818_1490995800-616507.png" ] },
			{ "timestamp": 1490999400, "url": [ "./_img/canvas/place30/1490995800-616507.png", "./_img/canvas/place30/1490999400-741732_1490995800-616507.png" ] },
			{ "timestamp": 1491001200, "url": [ "./_img/canvas/place30/1491004800-992283.png", "./_img/canvas/place30/1491001200-813338_1491004800-992283.png" ] },
			{ "timestamp": 1491003000, "url": [ "./_img/canvas/place30/1491004800-992283.png", "./_img/canvas/place30/1491003000-902107_1491004800-992283.png" ] },
			{ "timestamp": 1491004800, "url": [ "./_img/canvas/place30/1491004800-992283.png" ] },
			{ "timestamp": 1491006600, "url": [ "./_img/canvas/place30/1491004800-992283.png", "./_img/canvas/place30/1491006600-1058294_1491004800-992283.png" ] },
			{ "timestamp": 1491008400, "url": [ "./_img/canvas/place30/1491004800-992283.png", "./_img/canvas/place30/1491008400-1114360_1491004800-992283.png" ] },
			{ "timestamp": 1491010200, "url": [ "./_img/canvas/place30/1491013800-1279627.png", "./_img/canvas/place30/1491010200-1169175_1491013800-1279627.png" ] },
			{ "timestamp": 1491012000, "url": [ "./_img/canvas/place30/1491013800-1279627.png", "./_img/canvas/place30/1491012000-1224597_1491013800-1279627.png" ] },
			{ "timestamp": 1491013800, "url": [ "./_img/canvas/place30/1491013800-1279627.png" ] },
			{ "timestamp": 1491015600, "url": [ "./_img/canvas/place30/1491013800-1279627.png", "./_img/canvas/place30/1491015600-1333392_1491013800-1279627.png" ] },
			{ "timestamp": 1491017400, "url": [ "./_img/canvas/place30/1491013800-1279627.png", "./_img/canvas/place30/1491017400-1367728_1491013800-1279627.png" ] },
			{ "timestamp": 1491019200, "url": [ "./_img/canvas/place30/1491022800-1468262.png", "./_img/canvas/place30/1491019200-1401051_1491022800-1468262.png" ] },
			{ "timestamp": 1491021000, "url": [ "./_img/canvas/place30/1491022800-1468262.png", "./_img/canvas/place30/1491021000-1434902_1491022800-1468262.png" ] },
			{ "timestamp": 1491022800, "url": [ "./_img/canvas/place30/1491022800-1468262.png" ] },
			{ "timestamp": 1491024600, "url": [ "./_img/canvas/place30/1491022800-1468262.png", "./_img/canvas/place30/1491024600-1503853_1491022800-1468262.png" ] },
			{ "timestamp": 1491026400, "url": [ "./_img/canvas/place30/1491022800-1468262.png", "./_img/canvas/place30/1491026400-1547498_1491022800-1468262.png" ] },
			{ "timestamp": 1491028200, "url": [ "./_img/canvas/place30/1491031800-1676013.png", "./_img/canvas/place30/1491028200-1592257_1491031800-1676013.png" ] },
			{ "timestamp": 1491030000, "url": [ "./_img/canvas/place30/1491031800-1676013.png", "./_img/canvas/place30/1491030000-1634983_1491031800-1676013.png" ] },
			{ "timestamp": 1491031800, "url": [ "./_img/canvas/place30/1491031800-1676013.png" ] },
			{ "timestamp": 1491033600, "url": [ "./_img/canvas/place30/1491031800-1676013.png", "./_img/canvas/place30/1491033600-1716479_1491031800-1676013.png" ] },
			{ "timestamp": 1491035400, "url": [ "./_img/canvas/place30/1491031800-1676013.png", "./_img/canvas/place30/1491035400-1757386_1491031800-1676013.png" ] },
			{ "timestamp": 1491037200, "url": [ "./_img/canvas/place30/1491040800-1872834.png", "./_img/canvas/place30/1491037200-1797209_1491040800-1872834.png" ] },
			{ "timestamp": 1491039000, "url": [ "./_img/canvas/place30/1491040800-1872834.png", "./_img/canvas/place30/1491039000-1834586_1491040800-1872834.png" ] },
			{ "timestamp": 1491040800, "url": [ "./_img/canvas/place30/1491040800-1872834.png" ] },
			{ "timestamp": 1491042600, "url": [ "./_img/canvas/place30/1491040800-1872834.png", "./_img/canvas/place30/1491042600-1911857_1491040800-1872834.png" ] },
			{ "timestamp": 1491044400, "url": [ "./_img/canvas/place30/1491040800-1872834.png", "./_img/canvas/place30/1491044400-1953062_1491040800-1872834.png" ] },
			{ "timestamp": 1491046200, "url": [ "./_img/canvas/place30/1491049800-2094349.png", "./_img/canvas/place30/1491046200-1995900_1491049800-2094349.png" ] },
			{ "timestamp": 1491048000, "url": [ "./_img/canvas/place30/1491049800-2094349.png", "./_img/canvas/place30/1491048000-2043256_1491049800-2094349.png" ] },
			{ "timestamp": 1491049800, "url": [ "./_img/canvas/place30/1491049800-2094349.png" ] },
			{ "timestamp": 1491051600, "url": [ "./_img/canvas/place30/1491049800-2094349.png", "./_img/canvas/place30/1491051600-2149787_1491049800-2094349.png" ] },
			{ "timestamp": 1491053400, "url": [ "./_img/canvas/place30/1491049800-2094349.png", "./_img/canvas/place30/1491053400-2209827_1491049800-2094349.png" ] },
			{ "timestamp": 1491055200, "url": [ "./_img/canvas/place30/1491058800-2413174.png", "./_img/canvas/place30/1491055200-2273562_1491058800-2413174.png" ] },
			{ "timestamp": 1491057000, "url": [ "./_img/canvas/place30/1491058800-2413174.png", "./_img/canvas/place30/1491057000-2341321_1491058800-2413174.png" ] },
			{ "timestamp": 1491058800, "url": [ "./_img/canvas/place30/1491058800-2413174.png" ] },
			{ "timestamp": 1491060600, "url": [ "./_img/canvas/place30/1491058800-2413174.png", "./_img/canvas/place30/1491060600-2488232_1491058800-2413174.png" ] },
			{ "timestamp": 1491062400, "url": [ "./_img/canvas/place30/1491058800-2413174.png", "./_img/canvas/place30/1491062400-2567466_1491058800-2413174.png" ] },
			{ "timestamp": 1491064200, "url": [ "./_img/canvas/place30/1491067800-2828090.png", "./_img/canvas/place30/1491064200-2651365_1491067800-2828090.png" ] },
			{ "timestamp": 1491066000, "url": [ "./_img/canvas/place30/1491067800-2828090.png", "./_img/canvas/place30/1491066000-2738014_1491067800-2828090.png" ] },
			{ "timestamp": 1491067800, "url": [ "./_img/canvas/place30/1491067800-2828090.png" ] },
			{ "timestamp": 1491069600, "url": [ "./_img/canvas/place30/1491067800-2828090.png", "./_img/canvas/place30/1491069600-2921588_1491067800-2828090.png" ] },
			{ "timestamp": 1491071400, "url": [ "./_img/canvas/place30/1491067800-2828090.png", "./_img/canvas/place30/1491071400-3017045_1491067800-2828090.png" ] },
			{ "timestamp": 1491073200, "url": [ "./_img/canvas/place30/1491076800-3315962.png", "./_img/canvas/place30/1491073200-3114774_1491076800-3315962.png" ] },
			{ "timestamp": 1491075000, "url": [ "./_img/canvas/place30/1491076800-3315962.png", "./_img/canvas/place30/1491075000-3214399_1491076800-3315962.png" ] },
			{ "timestamp": 1491076800, "url": [ "./_img/canvas/place30/1491076800-3315962.png" ] },
			{ "timestamp": 1491078600, "url": [ "./_img/canvas/place30/1491076800-3315962.png", "./_img/canvas/place30/1491078600-3420007_1491076800-3315962.png" ] },
			{ "timestamp": 1491080400, "url": [ "./_img/canvas/place30/1491076800-3315962.png", "./_img/canvas/place30/1491080400-3530675_1491076800-3315962.png" ] },
			{ "timestamp": 1491082200, "url": [ "./_img/canvas/place30/1491085800-3998967.png", "./_img/canvas/place30/1491082200-3643511_1491085800-3998967.png" ] },
			{ "timestamp": 1491084000, "url": [ "./_img/canvas/place30/1491085800-3998967.png", "./_img/canvas/place30/1491084000-3813621_1491085800-3998967.png" ] },
			{ "timestamp": 1491085800, "url": [ "./_img/canvas/place30/1491085800-3998967.png" ] },
			{ "timestamp": 1491087600, "url": [ "./_img/canvas/place30/1491085800-3998967.png", "./_img/canvas/place30/1491087600-4182569_1491085800-3998967.png" ] },
			{ "timestamp": 1491089400, "url": [ "./_img/canvas/place30/1491085800-3998967.png", "./_img/canvas/place30/1491089400-4359643_1491085800-3998967.png" ] },
			{ "timestamp": 1491091200, "url": [ "./_img/canvas/place30/1491094800-4857142.png", "./_img/canvas/place30/1491091200-4530163_1491094800-4857142.png" ] },
			{ "timestamp": 1491093000, "url": [ "./_img/canvas/place30/1491094800-4857142.png", "./_img/canvas/place30/1491093000-4695275_1491094800-4857142.png" ] },
			{ "timestamp": 1491094800, "url": [ "./_img/canvas/place30/1491094800-4857142.png" ] },
			{ "timestamp": 1491096600, "url": [ "./_img/canvas/place30/1491094800-4857142.png", "./_img/canvas/place30/1491096600-5013603_1491094800-4857142.png" ] },
			{ "timestamp": 1491098400, "url": [ "./_img/canvas/place30/1491094800-4857142.png", "./_img/canvas/place30/1491098400-5164337_1491094800-4857142.png" ] },
			{ "timestamp": 1491100200, "url": [ "./_img/canvas/place30/1491103800-5602937.png", "./_img/canvas/place30/1491100200-5312745_1491103800-5602937.png" ] },
			{ "timestamp": 1491102000, "url": [ "./_img/canvas/place30/1491103800-5602937.png", "./_img/canvas/place30/1491102000-5460103_1491103800-5602937.png" ] },
			{ "timestamp": 1491103800, "url": [ "./_img/canvas/place30/1491103800-5602937.png" ] },
			{ "timestamp": 1491105600, "url": [ "./_img/canvas/place30/1491103800-5602937.png", "./_img/canvas/place30/1491105600-5749653_1491103800-5602937.png" ] },
			{ "timestamp": 1491107400, "url": [ "./_img/canvas/place30/1491103800-5602937.png", "./_img/canvas/place30/1491107400-5901264_1491103800-5602937.png" ] },
			{ "timestamp": 1491109200, "url": [ "./_img/canvas/place30/1491112800-6312996.png", "./_img/canvas/place30/1491109200-6046196_1491112800-6312996.png" ] },
			{ "timestamp": 1491111000, "url": [ "./_img/canvas/place30/1491112800-6312996.png", "./_img/canvas/place30/1491111000-6183539_1491112800-6312996.png" ] },
			{ "timestamp": 1491112800, "url": [ "./_img/canvas/place30/1491112800-6312996.png" ] },
			{ "timestamp": 1491114600, "url": [ "./_img/canvas/place30/1491112800-6312996.png", "./_img/canvas/place30/1491114600-6434006_1491112800-6312996.png" ] },
			{ "timestamp": 1491116400, "url": [ "./_img/canvas/place30/1491112800-6312996.png", "./_img/canvas/place30/1491116400-6548270_1491112800-6312996.png" ] },
			{ "timestamp": 1491118200, "url": [ "./_img/canvas/place30/1491121800-6867850.png", "./_img/canvas/place30/1491118200-6657874_1491121800-6867850.png" ] },
			{ "timestamp": 1491120000, "url": [ "./_img/canvas/place30/1491121800-6867850.png", "./_img/canvas/place30/1491120000-6764553_1491121800-6867850.png" ] },
			{ "timestamp": 1491121800, "url": [ "./_img/canvas/place30/1491121800-6867850.png" ] },
			{ "timestamp": 1491123600, "url": [ "./_img/canvas/place30/1491121800-6867850.png", "./_img/canvas/place30/1491123600-6968836_1491121800-6867850.png" ] },
			{ "timestamp": 1491125400, "url": [ "./_img/canvas/place30/1491121800-6867850.png", "./_img/canvas/place30/1491125400-7070468_1491121800-6867850.png" ] },
			{ "timestamp": 1491127200, "url": [ "./_img/canvas/place30/1491130800-7382752.png", "./_img/canvas/place30/1491127200-7172885_1491130800-7382752.png" ] },
			{ "timestamp": 1491129000, "url": [ "./_img/canvas/place30/1491130800-7382752.png", "./_img/canvas/place30/1491129000-7276850_1491130800-7382752.png" ] },
			{ "timestamp": 1491130800, "url": [ "./_img/canvas/place30/1491130800-7382752.png" ] },
			{ "timestamp": 1491132600, "url": [ "./_img/canvas/place30/1491130800-7382752.png", "./_img/canvas/place30/1491132600-7493329_1491130800-7382752.png" ] },
			{ "timestamp": 1491134400, "url": [ "./_img/canvas/place30/1491130800-7382752.png", "./_img/canvas/place30/1491134400-7606419_1491130800-7382752.png" ] },
			{ "timestamp": 1491136200, "url": [ "./_img/canvas/place30/1491139800-7975063.png", "./_img/canvas/place30/1491136200-7723447_1491139800-7975063.png" ] },
			{ "timestamp": 1491138000, "url": [ "./_img/canvas/place30/1491139800-7975063.png", "./_img/canvas/place30/1491138000-7845735_1491139800-7975063.png" ] },
			{ "timestamp": 1491139800, "url": [ "./_img/canvas/place30/1491139800-7975063.png" ] },
			{ "timestamp": 1491141600, "url": [ "./_img/canvas/place30/1491139800-7975063.png", "./_img/canvas/place30/1491141600-8112443_1491139800-7975063.png" ] },
			{ "timestamp": 1491143400, "url": [ "./_img/canvas/place30/1491139800-7975063.png", "./_img/canvas/place30/1491143400-8257413_1491139800-7975063.png" ] },
			{ "timestamp": 1491145200, "url": [ "./_img/canvas/place30/1491148800-8737738.png", "./_img/canvas/place30/1491145200-8410809_1491148800-8737738.png" ] },
			{ "timestamp": 1491147000, "url": [ "./_img/canvas/place30/1491148800-8737738.png", "./_img/canvas/place30/1491147000-8571020_1491148800-8737738.png" ] },
			{ "timestamp": 1491148800, "url": [ "./_img/canvas/place30/1491148800-8737738.png" ] },
			{ "timestamp": 1491150600, "url": [ "./_img/canvas/place30/1491148800-8737738.png", "./_img/canvas/place30/1491150600-8909536_1491148800-8737738.png" ] },
			{ "timestamp": 1491152400, "url": [ "./_img/canvas/place30/1491148800-8737738.png", "./_img/canvas/place30/1491152400-9084460_1491148800-8737738.png" ] },
			{ "timestamp": 1491154200, "url": [ "./_img/canvas/place30/1491157800-9639499.png", "./_img/canvas/place30/1491154200-9263589_1491157800-9639499.png" ] },
			{ "timestamp": 1491156000, "url": [ "./_img/canvas/place30/1491157800-9639499.png", "./_img/canvas/place30/1491156000-9447689_1491157800-9639499.png" ] },
			{ "timestamp": 1491157800, "url": [ "./_img/canvas/place30/1491157800-9639499.png" ] },
			{ "timestamp": 1491159600, "url": [ "./_img/canvas/place30/1491157800-9639499.png", "./_img/canvas/place30/1491159600-9837611_1491157800-9639499.png" ] },
			{ "timestamp": 1491161400, "url": [ "./_img/canvas/place30/1491157800-9639499.png", "./_img/canvas/place30/1491161400-10039138_1491157800-9639499.png" ] },
			{ "timestamp": 1491163200, "url": [ "./_img/canvas/place30/1491166800-10626539.png", "./_img/canvas/place30/1491163200-10239053_1491166800-10626539.png" ] },
			{ "timestamp": 1491165000, "url": [ "./_img/canvas/place30/1491166800-10626539.png", "./_img/canvas/place30/1491165000-10441072_1491166800-10626539.png" ] },
			{ "timestamp": 1491166800, "url": [ "./_img/canvas/place30/1491166800-10626539.png" ] },
			{ "timestamp": 1491168600, "url": [ "./_img/canvas/place30/1491166800-10626539.png", "./_img/canvas/place30/1491168600-10817644_1491166800-10626539.png" ] },
			{ "timestamp": 1491170400, "url": [ "./_img/canvas/place30/1491166800-10626539.png", "./_img/canvas/place30/1491170400-11012804_1491166800-10626539.png" ] },
			{ "timestamp": 1491172200, "url": [ "./_img/canvas/place30/1491175800-11576999.png", "./_img/canvas/place30/1491172200-11204045_1491175800-11576999.png" ] },
			{ "timestamp": 1491174000, "url": [ "./_img/canvas/place30/1491175800-11576999.png", "./_img/canvas/place30/1491174000-11393405_1491175800-11576999.png" ] },
			{ "timestamp": 1491175800, "url": [ "./_img/canvas/place30/1491175800-11576999.png" ] },
			{ "timestamp": 1491177600, "url": [ "./_img/canvas/place30/1491175800-11576999.png", "./_img/canvas/place30/1491177600-11754405_1491175800-11576999.png" ] },
			{ "timestamp": 1491179400, "url": [ "./_img/canvas/place30/1491175800-11576999.png", "./_img/canvas/place30/1491179400-11928887_1491175800-11576999.png" ] },
			{ "timestamp": 1491181200, "url": [ "./_img/canvas/place30/1491184800-12451771.png", "./_img/canvas/place30/1491181200-12103302_1491184800-12451771.png" ] },
			{ "timestamp": 1491183000, "url": [ "./_img/canvas/place30/1491184800-12451771.png", "./_img/canvas/place30/1491183000-12278403_1491184800-12451771.png" ] },
			{ "timestamp": 1491184800, "url": [ "./_img/canvas/place30/1491184800-12451771.png" ] },
			{ "timestamp": 1491186600, "url": [ "./_img/canvas/place30/1491184800-12451771.png", "./_img/canvas/place30/1491186600-12622130_1491184800-12451771.png" ] },
			{ "timestamp": 1491188400, "url": [ "./_img/canvas/place30/1491184800-12451771.png", "./_img/canvas/place30/1491188400-12790677_1491184800-12451771.png" ] },
			{ "timestamp": 1491190200, "url": [ "./_img/canvas/place30/1491193800-13268910.png", "./_img/canvas/place30/1491190200-12955266_1491193800-13268910.png" ] },
			{ "timestamp": 1491192000, "url": [ "./_img/canvas/place30/1491193800-13268910.png", "./_img/canvas/place30/1491192000-13114471_1491193800-13268910.png" ] },
			{ "timestamp": 1491193800, "url": [ "./_img/canvas/place30/1491193800-13268910.png" ] },
			{ "timestamp": 1491195600, "url": [ "./_img/canvas/place30/1491193800-13268910.png", "./_img/canvas/place30/1491195600-13416430_1491193800-13268910.png" ] },
			{ "timestamp": 1491197400, "url": [ "./_img/canvas/place30/1491193800-13268910.png", "./_img/canvas/place30/1491197400-13557732_1491193800-13268910.png" ] },
			{ "timestamp": 1491199200, "url": [ "./_img/canvas/place30/1491202800-13932512.png", "./_img/canvas/place30/1491199200-13689818_1491202800-13932512.png" ] },
			{ "timestamp": 1491201000, "url": [ "./_img/canvas/place30/1491202800-13932512.png", "./_img/canvas/place30/1491201000-13813483_1491202800-13932512.png" ] },
			{ "timestamp": 1491202800, "url": [ "./_img/canvas/place30/1491202800-13932512.png" ] },
			{ "timestamp": 1491204600, "url": [ "./_img/canvas/place30/1491202800-13932512.png", "./_img/canvas/place30/1491204600-14044772_1491202800-13932512.png" ] },
			{ "timestamp": 1491206400, "url": [ "./_img/canvas/place30/1491202800-13932512.png", "./_img/canvas/place30/1491206400-14151156_1491202800-13932512.png" ] },
			{ "timestamp": 1491208200, "url": [ "./_img/canvas/place30/1491211800-14453377.png", "./_img/canvas/place30/1491208200-14253517_1491211800-14453377.png" ] },
			{ "timestamp": 1491210000, "url": [ "./_img/canvas/place30/1491211800-14453377.png", "./_img/canvas/place30/1491210000-14353620_1491211800-14453377.png" ] },
			{ "timestamp": 1491211800, "url": [ "./_img/canvas/place30/1491211800-14453377.png" ] },
			{ "timestamp": 1491213600, "url": [ "./_img/canvas/place30/1491211800-14453377.png", "./_img/canvas/place30/1491213600-14555504_1491211800-14453377.png" ] },
			{ "timestamp": 1491215400, "url": [ "./_img/canvas/place30/1491211800-14453377.png", "./_img/canvas/place30/1491215400-14663906_1491211800-14453377.png" ] },
			{ "timestamp": 1491217200, "url": [ "./_img/canvas/place30/1491220800-15025272.png", "./_img/canvas/place30/1491217200-14778209_1491220800-15025272.png" ] },
			{ "timestamp": 1491219000, "url": [ "./_img/canvas/place30/1491220800-15025272.png", "./_img/canvas/place30/1491219000-14897941_1491220800-15025272.png" ] },
			{ "timestamp": 1491220800, "url": [ "./_img/canvas/place30/1491220800-15025272.png" ] },
			{ "timestamp": 1491222600, "url": [ "./_img/canvas/place30/1491220800-15025272.png", "./_img/canvas/place30/1491222600-15161407_1491220800-15025272.png" ] },
			{ "timestamp": 1491224400, "url": [ "./_img/canvas/place30/1491220800-15025272.png", "./_img/canvas/place30/1491224400-15306078_1491220800-15025272.png" ] },
			{ "timestamp": 1491226200, "url": [ "./_img/canvas/place30/1491229800-15763823.png", "./_img/canvas/place30/1491226200-15453973_1491229800-15763823.png" ] },
			{ "timestamp": 1491228000, "url": [ "./_img/canvas/place30/1491229800-15763823.png", "./_img/canvas/place30/1491228000-15605751_1491229800-15763823.png" ] },
			{ "timestamp": 1491229800, "url": [ "./_img/canvas/place30/1491229800-15763823.png" ] },
			{ "timestamp": 1491231600, "url": [ "./_img/canvas/place30/1491229800-15763823.png", "./_img/canvas/place30/1491231600-15925913_1491229800-15763823.png" ] },
			{ "timestamp": 1491233400, "url": [ "./_img/canvas/place30/1491229800-15763823.png", "./_img/canvas/place30/1491233400-16086625_1491229800-15763823.png" ] },
			{ "timestamp": 1491235200, "url": [ "./_img/canvas/place30/1491238734-16559896.png", "./_img/canvas/place30/1491235200-16252152_1491238734-16559896.png" ] },
			{ "timestamp": 1491237000, "url": [ "./_img/canvas/place30/1491238734-16559896.png", "./_img/canvas/place30/1491237000-16410788_1491238734-16559896.png" ] },
			{ "timestamp": 1491238734, "url": [ "./_img/canvas/place30/1491238734-16559896.png" ] },
		],
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 192 192" aria-hidden="true"><polygon points="154 0 154 38 39 38 39 192 0 192 0 0"/><polygon points="192 38 192 192 77 192 77 153 154 153 154 38"/><rect x="77" y="77" width="38" height="38"/></svg>'
	},
	tfc: {
		name: "The Final Clean",
		code: "T",
		default: 0,
		drawablePeriods: [0, 0],
		versions: [
			{
				timestamp: "Final",
				url: ["./_img/canvas/place30/1491238734-16559896.png", "./_img/canvas/tfc/orig.png"],
			},
			{
				timestamp: "with Void",
				url: ["./_img/canvas/place30/1491238734-16559896.png", "./_img/canvas/tfc/void.png"],
			},
		],
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 192 192" aria-hidden="true"><defs><style>.a{fill-rule:evenodd;}</style></defs><path class="a" d="M69.79,83.55c-.47,.65-.59,1.35-.59,1.35-.26,1.47,.76,2.72,.92,3.12,2.84,7.1,4.49,13.93,3.97,16.39-.47,2.18-5.6,5.65-12.36,8.33-3.63,1.44-6.11,2.99-8.04,5.01-7.17,7.51-10.24,17.86-7.14,24.05,3.93,7.84,18.38,5.86,28.05-3.85,2.09-2.1,3.15-3.83,6.63-10.77,2.97-5.93,4.26-8.05,5.47-8.95,2.04-1.52,9.82,.1,17.41,3.64,1.71,.8,2.31,1.04,2.78,.98,0,0,.22-.05,.43-.14,1.31-.59,17.43-17,25.58-25.34-1.79,.09-3.57,.18-5.36,.28-2.84,2.63-5.68,5.27-8.52,7.9-10.85-10.85-21.7-21.71-32.55-32.56,1.73-1.8,3.46-3.6,5.18-5.4-.29-1.56-.57-3.12-.86-4.69-1.34,1.27-19.42,18.45-21.01,20.66Zm-10.45,44.57c2.5,0,4.53,2.03,4.53,4.53s-2.03,4.53-4.53,4.53-4.53-2.03-4.53-4.53,2.03-4.53,4.53-4.53Z"/><path class="f" d="M132.9,97.36c-.88,.22-7.88,1.92-9.91-1.04-1.11-1.62-1.05-4.71-.52-6.57,.74-2.59,.9-4.06,.25-4.73-.73-.76-2.03-.31-3.73-.18-3.4,.27-8.08-.86-9.6-3.16-2.77-4.21,4.48-13.03,2.31-14.69-.17-.13-.34-.16-.67-.22-4.24-.73-6.79,4.71-11.66,5.1-2.93,.24-6.21-1.39-7.72-4.02-1.11-1.94-1-3.96-.86-4.95h0s7.38-7.39,17.6-17.52c12.75,12.73,25.51,25.47,38.26,38.2l-13.75,13.79Z"/><polygon points="154 0 154 38 39 38 39 192 0 192 0 0"/><polygon points="192 38 192 192 77 192 77 153 154 153 154 38"/></svg>'
	}
}
window.variationsConfig = variationsConfig

let defaultVariation = 'default'
window.defaultVariation = defaultVariation

let defaultPeriod = variationsConfig[defaultVariation].default
window.defaultPeriod = defaultPeriod

const useNumericalId = false
window.useNumericalId = useNumericalId

console.info(`%cThe 2017 r/place Atlas
%cCopyright (c) 2017 Roland Rytz <roland@draemm.li>
Copyright (c) 2022 Place Atlas contributors
Licensed under AGPL-3.0 (https://2017.place-atlas.stefanocoding.me/license.txt)

https://2017.place-atlas.stefanocoding.me/
https://discord.gg/pJkm23b2nA
https://reddit.com/r/placeatlas2
https://github.com/placeAtlas/atlas-2017

To get the image of the canvas, use downloadCanvas().
`, 'font-size: 150%; line-height: 150%', '')