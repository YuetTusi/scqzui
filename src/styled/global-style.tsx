import { createGlobalStyle } from 'styled-components';
import theme from '../../theme/cyan.json';

/**
 * 定义全局样式
 */
const GlobalStyle = createGlobalStyle`

    html{
        font-size: 62.5%;
        height: 100%;
    }
    body{
        height: 100%;
        font-size: 1.4rem;
		font-family:"Microsoft Yahei","CESI黑体-GB13000","Noto Sans CJK SC","NSimSun","Arial";
    }
	#root{
		position: relative;
		width:auto;
		height: 100%;
        background-color: #181d30;
		/* background-image: linear-gradient(to right,#181d30,#222739); */
	}

    //Webkit滚动条样式
    ::-webkit-scrollbar {
        width: 10px;
		height: 10px;
    }
	::-webkit-scrollbar:horizontal{
		width: 0;
		height: 0;
	}
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #ddd;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:hover{
        background: #ccc;
    }
    ::-webkit-scrollbar-thumb:active{
        background: #999;
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background: #c1c1c1;
    }

	.primary-color{
		color:${theme['primary-color'] ?? '#0fb9b1'};
	}
	.cloud-color,.warn-color{
		color:${theme['warn-color'] ?? '#f9ca24'};
	}
	.error-color{
		color:${theme['error-color'] ?? '#ff3333'};
	}

	.ant-empty-description{
		color:#ffffffd9;
	}
	.ant-modal-mask,.ant-modal-wrap{
		top:22px;
	}
	.ant-drawer{
		z-index: 1999;
	}

    //悬停动画
    /* Sweep To Right */
    .hvr-sweep-to-right {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
        position: relative;
        -webkit-transition-property: color;
        transition-property: color;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
    }
    .hvr-sweep-to-right:before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${theme['primary-color'] ?? '#0fb9b1'};
        border-radius: 2px;
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0 50%;
        transform-origin: 0 50%;
        -webkit-transition-property: transform;
        transition-property: transform;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    .hvr-sweep-to-right:hover, .hvr-sweep-to-right:focus, .hvr-sweep-to-right:active {
        color: white;
    }
    .hvr-sweep-to-right:hover:before, .hvr-sweep-to-right:focus:before, .hvr-sweep-to-right:active:before {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }

    //重写Modal
    .zero-padding-body {
        .ant-modal-body {
            padding: 0 !important;
        }
    }
	//
	.ant-slider-track{
		background-color:#0fb9b1 !important;
	}

//重写ztree部分样式
span.tmpzTreeMove_arrow {
	background-image: url(${require('./images/ztree/zTreeStandard.png')}) !important;
}

.ztree {
	li span.button{
		background-image:url("./images/ztree/zTreeStandard.png") !important;
	}
	li a.curSelectedNode{
		color:#fff;
		border:1px #0b706c solid;
		background-color: #019099;
	}
	.tree-node-tip {
		& > h6 {
			font-size: 12px;
			color: #0fb9b1;
			padding-bottom: 4px;
			font-weight: bold;
		}
		position: absolute;
		left: 360px;
		width: 300px;
		border: 1px solid #fff;
		border-radius: 2px;
		font-size: 1.2rem;
		white-space: normal;
		padding: 4px;
		background-color: #141414;
		z-index: 10;

		dt {
			margin-bottom: 2px;
		}
		dd {
			font-weight: normal;
			color: #0fb9b1;
			padding: 2px 0;
		}
	}

	li {
		.ext {
			display: inline-block;
			cursor: pointer !important;
			color: ${theme['warn-color'] ?? '#f9ca24'};
			font-weight: bold;
			vertical-align: bottom;
		}
		.note {
			display: inline-block;
			max-width: 500px;
			overflow: hidden;
			text-overflow: ellipsis;
			font-style: normal;
			font-weight: bold;
			color: ${theme['primary-color'] ?? '#0fb9b1'};
			vertical-align: middle;
			& > span {
				font-weight: normal;
			}
		}
		a {
            color:#ffffffd9;
			position: relative;
			&:hover {
				cursor: default;
				text-decoration: none;
			}
			&.curSelectedNode {
				background-color: fade(#fff, 15%) !important;
				border: 1px solid fade(#fff, 15%) !important;
			}
		}
		span {
			margin-left: 3px;
			font-family: Arial, Helvetica, sans-serif;
			&.button {
				cursor: default;
				position: relative;
				top: -1px;
				background-image: url(${require('./images/ztree/zTreeStandard.png')}) !important;
				&.type_IM_ico_docu,
				&.type_IM_ico_open,
				&.type_IM_ico_close {
					background-image: url(${require('./images/ztree/app/IM.png')}) !important;
				}
				&.type_SHOPPING_ico_docu,
				&.type_SHOPPING_ico_open,
				&.type_SHOPPING_ico_close {
					background-image: url(${require('./images/ztree/app/SHOPPING.png')}) !important;
				}
				&.type_BROWSER_ico_docu,
				&.type_BROWSER_ico_open,
				&.type_BROWSER_ico_close {
					background-image: url(${require('./images/ztree/app/BROWSER.png')}) !important;
				}
				&.type_EMAIL_ico_docu,
				&.type_EMAIL_ico_open,
				&.type_EMAIL_ico_close {
					background-image: url(${require('./images/ztree/app/EMAIL.png')}) !important;
				}
				&.type_WEIBO_ico_docu,
				&.type_WEIBO_ico_open,
				&.type_WEIBO_ico_close {
					background-image: url(${require('./images/ztree/app/WEIBO.png')}) !important;
				}
				&.type_MAP_ico_docu,
				&.type_MAP_ico_open,
				&.type_MAP_ico_close {
					background-image: url(${require('./images/ztree/app/MAP.png')}) !important;
				}
				&.type_TRAVEL_ico_docu,
				&.type_TRAVEL_ico_open,
				&.type_TRAVEL_ico_close {
					background-image: url(${require('./images/ztree/app/TRAVEL.png')}) !important;
				}
				&.type_NETDISK_ico_docu,
				&.type_NETDISK_ico_open,
				&.type_NETDISK_ico_close {
					background-image: url(${require('./images/ztree/app/NETDISK.png')}) !important;
				}
				&.type_EXPRESS_ico_docu,
				&.type_EXPRESS_ico_open,
				&.type_EXPRESS_ico_close {
					background-image: url(${require('./images/ztree/app/EXPRESS.png')}) !important;
				}
				&.type_KeyboardInput_ico_docu,
				&.type_KeyboardInput_ico_open,
				&.type_KeyboardInput_ico_close {
					background-image: url(${require('./images/ztree/app/KeyboardInput.png')}) !important;
				}
				&.type_BLOCKCHAIN_ico_docu,
				&.type_BLOCKCHAIN_ico_open,
				&.type_BLOCKCHAIN_ico_close {
					background-image: url(${require('./images/ztree/app/BLOCKCHAIN.png')}) !important;
				}
				&.type_OTHERS_ico_docu,
				&.type_OTHERS_ico_open,
				&.type_OTHERS_ico_close {
					background-image: url(${require('./images/ztree/app/OTHERS.png')}) !important;
				}
				&.type_VPN_ico_docu,
				&.type_VPN_ico_open,
				&.type_VPN_ico_close {
					background-image: url(${require('./images/ztree/app/VPN.png')}) !important;
				}
				&.app_root_ico_docu,
				&.app_root_ico_open,
				&.app_root_ico_close {
					background-image: url(${require('./images/ztree/app/root.png')}) !important;
				}
				//QQ
				&.app_1030001_ico_docu,
				&.app_1030001_ico_open,
				&.app_1030001_ico_close {
					background-image: url(${require('./images/ztree/app/1030001.png')}) !important;
				}
				//微信
				&.app_1030036_ico_docu,
				&.app_1030036_ico_open,
				&.app_1030036_ico_close {
					background-image: url(${require('./images/ztree/app/1030036.png')}) !important;
				}
				//企业微信
				&.app_1030236_ico_docu,
				&.app_1030236_ico_open,
				&.app_1030236_ico_close {
					background-image: url(${require('./images/ztree/app/1030236.png')}) !important;
				}
				//支付宝
				&.app_1290007_ico_docu,
				&.app_1290007_ico_open,
				&.app_1290007_ico_close {
					background-image: url(${require('./images/ztree/app/1290007.png')}) !important;
				}
				//抖音
				&.app_1400036_ico_docu,
				&.app_1400036_ico_open,
				&.app_1400036_ico_close {
					background-image: url(${require('./images/ztree/app/1400036.png')}) !important;
				}
				//快手
				&.app_1400026_ico_docu,
				&.app_1400026_ico_open,
				&.app_1400026_ico_close {
					background-image: url(${require('./images/ztree/app/1400026.png')}) !important;
				}
				//陌陌
				&.app_1030044_ico_docu,
				&.app_1030044_ico_open,
				&.app_1030044_ico_close {
					background-image: url(${require('./images/ztree/app/1030044.png')}) !important;
				}
				//豆瓣
				&.app_no_634a1dfa_ico_docu,
				&.app_no_634a1dfa_ico_open,
				&.app_no_634a1dfa_ico_close {
					background-image: url(${require('./images/ztree/app/no_634a1dfa.png')}) !important;
				}
				//米聊
				&.app_1030035_ico_docu,
				&.app_1030035_ico_open,
				&.app_1030035_ico_close {
					background-image: url(${require('./images/ztree/app/1030035.png')}) !important;
				}
				//探探
				&.app_1030206_ico_docu,
				&.app_1030206_ico_open,
				&.app_1030206_ico_close {
					background-image: url(${require('./images/ztree/app/1030206.png')}) !important;
				}
				//全民K歌
				&.app_1390006_ico_docu,
				&.app_1390006_ico_open,
				&.app_1390006_ico_close {
					background-image: url(${require('./images/ztree/app/1390006.png')}) !important;
				}
				//遇见
				&.app_1030056_ico_docu,
				&.app_1030056_ico_open,
				&.app_1030056_ico_close {
					background-image: url(${require('./images/ztree/app/1030056.png')}) !important;
				}
				//飞信
				&.app_1030028_ico_docu,
				&.app_1030028_ico_open,
				&.app_1030028_ico_close {
					background-image: url(${require('./images/ztree/app/1030028.png')}) !important;
				}
				//Skype
				&.app_1030027_ico_docu,
				&.app_1030027_ico_open,
				&.app_1030027_ico_close {
					background-image: url(${require('./images/ztree/app/1030027.png')}) !important;
				}
				//Facebook
				&.app_1030045_ico_docu,
				&.app_1030045_ico_open,
				&.app_1030045_ico_close {
					background-image: url(${require('./images/ztree/app/1030045.png')}) !important;
				}
				//人人网
				&.app_1030046_ico_docu,
				&.app_1030046_ico_open,
				&.app_1030046_ico_close {
					background-image: url(${require('./images/ztree/app/1030046.png')}) !important;
				}
				//易信
				&.app_1030047_ico_docu,
				&.app_1030047_ico_open,
				&.app_1030047_ico_close {
					background-image: url(${require('./images/ztree/app/1030047.png')}) !important;
				}
				//来往
				&.app_1030048_ico_docu,
				&.app_1030048_ico_open,
				&.app_1030048_ico_close {
					background-image: url(${require('./images/ztree/app/1030048.png')}) !important;
				}
				//旺信
				&.app_1030049_ico_docu,
				&.app_1030049_ico_open,
				&.app_1030049_ico_close {
					background-image: url(${require('./images/ztree/app/1030049.png')}) !important;
				}
				//Whatsapp
				&.app_1030038_ico_docu,
				&.app_1030038_ico_open,
				&.app_1030038_ico_close {
					background-image: url(${require('./images/ztree/app/1030038.png')}) !important;
				}
				//Blued
				&.app_1030146_ico_docu,
				&.app_1030146_ico_open,
				&.app_1030146_ico_close {
					background-image: url(${require('./images/ztree/app/1030146.png')}) !important;
				}
				//YY语音
				&.app_1030050_ico_docu,
				&.app_1030050_ico_open,
				&.app_1030050_ico_close {
					background-image: url(${require('./images/ztree/app/1030050.png')}) !important;
				}
				//LINE
				&.app_1030043_ico_docu,
				&.app_1030043_ico_open,
				&.app_1030043_ico_close {
					background-image: url(${require('./images/ztree/app/1030043.png')}) !important;
				}
				//viber
				&.app_1030053_ico_docu,
				&.app_1030053_ico_open,
				&.app_1030053_ico_close {
					background-image: url(${require('./images/ztree/app/1030053.png')}) !important;
				}
				//Telegram
				&.app_1030063_ico_docu,
				&.app_1030063_ico_open,
				&.app_1030063_ico_close {
					background-image: url(${require('./images/ztree/app/1030063.png')}) !important;
				}
				//TalkBox
				&.app_1030051_ico_docu,
				&.app_1030051_ico_open,
				&.app_1030051_ico_close {
					background-image: url(${require('./images/ztree/app/1030051.png')}) !important;
				}
				//voxer
				&.app_1030052_ico_docu,
				&.app_1030052_ico_open,
				&.app_1030052_ico_close {
					background-image: url(${require('./images/ztree/app/1030052.png')}) !important;
				}
				//coco
				&.app_1030057_ico_docu,
				&.app_1030057_ico_open,
				&.app_1030057_ico_close {
					background-image: url(${require('./images/ztree/app/1030057.png')}) !important;
				}
				//KakaoTalk
				&.app_1030058_ico_docu,
				&.app_1030058_ico_open,
				&.app_1030058_ico_close {
					background-image: url(${require('./images/ztree/app/1030058.png')}) !important;
				}
				//raid-call
				&.app_1030059_ico_docu,
				&.app_1030059_ico_open,
				&.app_1030059_ico_close {
					background-image: url(${require('./images/ztree/app/1030059.png')}) !important;
				}
				//有信
				&.app_1030060_ico_docu,
				&.app_1030060_ico_open,
				&.app_1030060_ico_close {
					background-image: url(${require('./images/ztree/app/1030060.png')}) !important;
				}
				//zello
				&.app_1030080_ico_docu,
				&.app_1030080_ico_open,
				&.app_1030080_ico_close {
					background-image: url(${require('./images/ztree/app/1030080.png')}) !important;
				}
				//hellotalk
				&.app_1030083_ico_docu,
				&.app_1030083_ico_open,
				&.app_1030083_ico_close {
					background-image: url(${require('./images/ztree/app/1030083.png')}) !important;
				}
				//kee-chat
				&.app_1039982_ico_docu,
				&.app_1039982_ico_open,
				&.app_1039982_ico_close {
					background-image: url(${require('./images/ztree/app/1039982.png')}) !important;
				}
				//oovoo
				&.app_1039981_ico_docu,
				&.app_1039981_ico_open,
				&.app_1039981_ico_close {
					background-image: url(${require('./images/ztree/app/1039981.png')}) !important;
				}
				//DiDi
				&.app_1039966_ico_docu,
				&.app_1039966_ico_open,
				&.app_1039966_ico_close {
					background-image: url(${require('./images/ztree/app/1039966.png')}) !important;
				}
				//nimbuzz
				&.app_1039953_ico_docu,
				&.app_1039953_ico_open,
				&.app_1039953_ico_close {
					background-image: url(${require('./images/ztree/app/1039953.png')}) !important;
				}
				//IMO
				&.app_1030210_ico_docu,
				&.app_1030210_ico_open,
				&.app_1030210_ico_close {
					background-image: url(${require('./images/ztree/app/1039952.png')}) !important;
				}
				//土豆聊天
				&.app_1030219_ico_docu,
				&.app_1030219_ico_open,
				&.app_1030219_ico_close {
					background-image: url(${require('./images/ztree/app/1030219.png')}) !important;
				}
				//WowChat
				&.app_1039998_ico_docu,
				&.app_1039998_ico_open,
				&.app_1039998_ico_close {
					background-image: url(${require('./images/ztree/app/1039998.png')}) !important;
				}
				//Sugram
				&.app_1030215_ico_docu,
				&.app_1030215_ico_open,
				&.app_1030215_ico_close {
					background-image: url(${require('./images/ztree/app/1030215.png')}) !important;
				}
				//连信
				&.app_1030224_ico_docu,
				&.app_1030224_ico_open,
				&.app_1030224_ico_close {
					background-image: url(${require('./images/ztree/app/1030224.png')}) !important;
				}
				//Zalo
				&.app_1030122_ico_docu,
				&.app_1030122_ico_open,
				&.app_1030122_ico_close {
					background-image: url(${require('./images/ztree/app/1030122.png')}) !important;
				}
				//crait
				&.app_no_68a9a29e_ico_docu,
				&.app_no_68a9a29e_ico_open,
				&.app_no_68a9a29e_ico_close {
					background-image: url(${require('./images/ztree/app/68a9a29e.png')}) !important;
				}
				//letstalk
				&.app_no_7bfd41fc_ico_docu,
				&.app_no_7bfd41fc_ico_open,
				&.app_no_7bfd41fc_ico_close {
					background-image: url(${require('./images/ztree/app/7bfd41fc.png')}) !important;
				}
				//Linkedin领英
				&.app_1030211_ico_docu,
				&.app_1030211_ico_open,
				&.app_1030211_ico_close {
					background-image: url(${require('./images/ztree/app/1030211.png')}) !important;
				}
				//FacebookManager
				&.app_no_9121f80c_ico_docu,
				&.app_no_9121f80c_ico_open,
				&.app_no_9121f80c_ico_close {
					background-image: url(${require('./images/ztree/app/9121f80c.png')}) !important;
				}
				//tamtam
				&.app_no_9a9c1476_ico_docu,
				&.app_no_9a9c1476_ico_open,
				&.app_no_9a9c1476_ico_close {
					background-image: url(${require('./images/ztree/app/9a9c1476.png')}) !important;
				}
				//GaGahi
				&.app_1030155_ico_docu,
				&.app_1030155_ico_open,
				&.app_1030155_ico_close {
					background-image: url(${require('./images/ztree/app/1030155.png')}) !important;
				}
				//68聊天
				&.app_no_60bb55fd_ico_docu,
				&.app_no_60bb55fd_ico_open,
				&.app_no_60bb55fd_ico_close {
					background-image: url(${require('./images/ztree/app/no_60bb55fd.png')}) !important;
				}
				//MEWE
				&.app_no_67d2e5c9e_ico_docu,
				&.app_no_67d2e5c9e_ico_open,
				&.app_no_67d2e5c9e_ico_close {
					background-image: url(${require('./images/ztree/app/no_67d2e5c9e.png')}) !important;
				}
				//蝙蝠
				&.app_1039997_ico_docu,
				&.app_1039997_ico_open,
				&.app_1039997_ico_close {
					background-image: url(${require('./images/ztree/app/1039997.png')}) !important;
				}
				//SafeChat
				&.app_1039995_ico_docu,
				&.app_1039995_ico_open,
				&.app_1039995_ico_close {
					background-image: url(${require('./images/ztree/app/1039995.png')}) !important;
				}
				//Soul
				&.app_1039996_ico_docu,
				&.app_1039996_ico_open,
				&.app_1039996_ico_close {
					background-image: url(${require('./images/ztree/app/1039996.png')}) !important;
				}
				//Discord
				&.app_1039994_ico_docu,
				&.app_1039994_ico_open,
				&.app_1039994_ico_close {
					background-image: url(${require('./images/ztree/app/1039994.png')}) !important;
				}
				//淘宝
				&.app_1220007_ico_docu,
				&.app_1220007_ico_open,
				&.app_1220007_ico_close {
					background-image: url(${require('./images/ztree/app/1220007.png')}) !important;
				}
				//天猫
				&.app_1220002_ico_docu,
				&.app_1220002_ico_open,
				&.app_1220002_ico_close {
					background-image: url(${require('./images/ztree/app/1220002.png')}) !important;
				}
				//当当
				&.app_1220001_ico_docu,
				&.app_1220001_ico_open,
				&.app_1220001_ico_close {
					background-image: url(${require('./images/ztree/app/1220001.png')}) !important;
				}
				//京东
				&.app_1220005_ico_docu,
				&.app_1220005_ico_open,
				&.app_1220005_ico_close {
					background-image: url(${require('./images/ztree/app/1220005.png')}) !important;
				}
				//苏宁易购
				&.app_1220006_ico_docu,
				&.app_1220006_ico_open,
				&.app_1220006_ico_close {
					background-image: url(${require('./images/ztree/app/1220006.png')}) !important;
				}
				//大众点评
				&.app_1220050_ico_docu,
				&.app_1220050_ico_open,
				&.app_1220050_ico_close {
					background-image: url(${require('./images/ztree/app/1220050.png')}) !important;
				}
				//美团
				&.app_1220040_ico_docu,
				&.app_1220040_ico_open,
				&.app_1220040_ico_close {
					background-image: url(${require('./images/ztree/app/1220040.png')}) !important;
				}
				//饿了么
				&.app_1229997_ico_docu,
				&.app_1229997_ico_open,
				&.app_1229997_ico_close {
					background-image: url(${require('./images/ztree/app/1229997.png')}) !important;
				}
				//美团外卖
				&.app_1229996_ico_docu,
				&.app_1229996_ico_open,
				&.app_1229996_ico_close {
					background-image: url(${require('./images/ztree/app/1229996.png')}) !important;
				}
				//转转
				&.app_1430019_ico_docu,
				&.app_1430019_ico_open,
				&.app_1430019_ico_close {
					background-image: url(${require('./images/ztree/app/1430019.png')}) !important;
				}
				//拼多多
				&.app_1220066_ico_docu,
				&.app_1220066_ico_open,
				&.app_1220066_ico_close {
					background-image: url(${require('./images/ztree/app/1220066.png')}) !important;
				}
				//闲鱼
				&.app_1220069_ico_docu,
				&.app_1220069_ico_open,
				&.app_1220069_ico_close {
					background-image: url(${require('./images/ztree/app/1220069.png')}) !important;
				}
				//小红书
				&.app_1220068_ico_docu,
				&.app_1220068_ico_open,
				&.app_1220068_ico_close {
					background-image: url(${require('./images/ztree/app/1220068.png')}) !important;
				}
				//网易严选
				&.app_1220081_ico_docu,
				&.app_1220081_ico_open,
				&.app_1220081_ico_close {
					background-image: url(${require('./images/ztree/app/1220081.png')}) !important;
				}
				//聚美优品
				&.app_1220013_ico_docu,
				&.app_1220013_ico_open,
				&.app_1220013_ico_close {
					background-image: url(${require('./images/ztree/app/1220013.png')}) !important;
				}
				//唯品会
				&.app_1220012_ico_docu,
				&.app_1220012_ico_open,
				&.app_1220012_ico_close {
					background-image: url(${require('./images/ztree/app/1220012.png')}) !important;
				}
				//蘑菇街
				&.app_1220042_ico_docu,
				&.app_1220042_ico_open,
				&.app_1220042_ico_close {
					background-image: url(${require('./images/ztree/app/1220042.png')}) !important;
				}
				//易购网
				&.app_1220079_ico_docu,
				&.app_1220079_ico_open,
				&.app_1220079_ico_close {
					background-image: url(${require('./images/ztree/app/1220079.png')}) !important;
				}
				//考拉海购
				&.app_1220061_ico_docu,
				&.app_1220061_ico_open,
				&.app_1220061_ico_close {
					background-image: url(${require('./images/ztree/app/1220061.png')}) !important;
				}
				//小米商城
				&.app_1220073_ico_docu,
				&.app_1220073_ico_open,
				&.app_1220073_ico_close {
					background-image: url(${require('./images/ztree/app/1220073.png')}) !important;
				}
				//孔夫子旧书网
				&.app_no_6c4724df_ico_docu,
				&.app_no_6c4724df_ico_open,
				&.app_no_6c4724df_ico_close {
					background-image: url(${require('./images/ztree/app/no_6c4724df.png')}) !important;
				}
				//孔夫子旧书网
				&.app_no_83b33cc33_ico_docu,
				&.app_no_83b33cc33_ico_open,
				&.app_no_83b33cc33_ico_close {
					background-image: url(${require('./images/ztree/app/no_83b33cc33.png')}) !important;
				}
				//1药网
				&.app_no_6eb19b588_ico_docu,
				&.app_no_6eb19b588_ico_open,
				&.app_no_6eb19b588_ico_close {
					background-image: url(${require('./images/ztree/app/no_6eb19b588.png')}) !important;
				}
				//屈臣氏
				&.app_no_b726d0d8d_ico_docu,
				&.app_no_b726d0d8d_ico_open,
				&.app_no_b726d0d8d_ico_close {
					background-image: url(${require('./images/ztree/app/no_b726d0d8d.png')}) !important;
				}
				//猫眼电影
				&.app_no_26239ckc_ico_docu,
				&.app_no_26239ckc_ico_open,
				&.app_no_26239ckc_ico_close {
					background-image: url(${require('./images/ztree/app/no_26239ckc.png')}) !important;
				}
				//惠农网
				&.app_no_e958af982_ico_docu,
				&.app_no_e958af982_ico_open,
				&.app_no_e958af982_ico_close {
					background-image: url(${require('./images/ztree/app/no_e958af982.png')}) !important;
				}
				//1688
				&.app_no_ae614c557_ico_docu,
				&.app_no_ae614c557_ico_open,
				&.app_no_ae614c557_ico_close {
					background-image: url(${require('./images/ztree/app/no_ae614c557.png')}) !important;
				}
				//默认浏览器
				&.app_1569998_ico_docu,
				&.app_1569998_ico_open,
				&.app_1569998_ico_close {
					background-image: url(${require('./images/ztree/app/1569998.png')}) !important;
				}
				//Chrome
				&.app_1560019_ico_docu,
				&.app_1560019_ico_open,
				&.app_1560019_ico_close {
					background-image: url(${require('./images/ztree/app/1560019.png')}) !important;
				}
				//Safari
				&.app_1560028_ico_docu,
				&.app_1560028_ico_open,
				&.app_1560028_ico_close {
					background-image: url(${require('./images/ztree/app/1560028.png')}) !important;
				}
				//Opera
				&.app_1560007_ico_docu,
				&.app_1560007_ico_open,
				&.app_1560007_ico_close {
					background-image: url(${require('./images/ztree/app/1560007.png')}) !important;
				}
				//UC浏览器
				&.app_1560013_ico_docu,
				&.app_1560013_ico_open,
				&.app_1560013_ico_close {
					background-image: url(${require('./images/ztree/app/1560013.png')}) !important;
				}
				//QQ浏览器
				&.app_1560011_ico_docu,
				&.app_1560011_ico_open,
				&.app_1560011_ico_close {
					background-image: url(${require('./images/ztree/app/1560011.png')}) !important;
				}
				//搜狗浏览器
				&.app_1560002_ico_docu,
				&.app_1560002_ico_open,
				&.app_1560002_ico_close {
					background-image: url(${require('./images/ztree/app/1560002.png')}) !important;
				}
				//海豚浏览器
				&.app_1560021_ico_docu,
				&.app_1560021_ico_open,
				&.app_1560021_ico_close {
					background-image: url(${require('./images/ztree/app/1560021.png')}) !important;
				}
				//猎豹浏览器
				&.app_1560003_ico_docu,
				&.app_1560003_ico_open,
				&.app_1560003_ico_close {
					background-image: url(${require('./images/ztree/app/1560003.png')}) !important;
				}
				//百度浏览器
				&.app_1560001_ico_docu,
				&.app_1560001_ico_open,
				&.app_1560001_ico_close {
					background-image: url(${require('./images/ztree/app/1560001.png')}) !important;
				}
				//百度贴吧
				&.app_1070006_ico_docu,
				&.app_1070006_ico_open,
				&.app_1070006_ico_close {
					background-image: url(${require('./images/ztree/app/1070006.png')}) !important;
				}
				//百度
				&.app_1560025_ico_docu,
				&.app_1560025_ico_open,
				&.app_1560025_ico_close {
					background-image: url(${require('./images/ztree/app/1560025.png')}) !important;
				}
				//360浏览器
				&.app_1560004_ico_docu,
				&.app_1560004_ico_open,
				&.app_1560004_ico_close {
					background-image: url(${require('./images/ztree/app/1560004.png')}) !important;
				}
				//知乎
				&.app_no_d2fca57b_ico_docu,
				&.app_no_d2fca57b_ico_open,
				&.app_no_d2fca57b_ico_close {
					background-image: url(${require('./images/ztree/app/no_d2fca57b.png')}) !important;
				}
				//自带邮箱
				&.app_01003_ico_docu,
				&.app_01003_ico_open,
				&.app_01003_ico_close {
					background-image: url(${require('./images/ztree/app/01003.png')}) !important;
				}
				//QQ邮箱
				&.app_01007_ico_docu,
				&.app_01007_ico_open,
				&.app_01007_ico_close {
					background-image: url(${require('./images/ztree/app/01007.png')}) !important;
				}
				//网易邮箱
				&.app_01997_ico_docu,
				&.app_01997_ico_open,
				&.app_01997_ico_close {
					background-image: url(${require('./images/ztree/app/01997.png')}) !important;
				}
				//网易邮箱大师
				&.app_01996_ico_docu,
				&.app_01996_ico_open,
				&.app_01996_ico_close {
					background-image: url(${require('./images/ztree/app/01996.png')}) !important;
				}
				//GMail
				&.app_1010033_ico_docu,
				&.app_1010033_ico_open,
				&.app_1010033_ico_close {
					background-image: url(${require('./images/ztree/app/1010033.png')}) !important;
				}
				//139邮箱
				&.app_1010012_ico_docu,
				&.app_1010012_ico_open,
				&.app_1010012_ico_open {
					background-image: url(${require('./images/ztree/app/1010012.png')}) !important;
				}
				//189邮箱
				&.app_1010013_ico_docu,
				&.app_1010013_ico_open,
				&.app_1010013_ico_close {
					background-image: url(${require('./images/ztree/app/1010013.png')}) !important;
				}
				//Outlook
				&.app_no_cd0fbb784_ico_docu,
				&.app_no_cd0fbb784_ico_open,
				&.app_no_cd0fbb784_ico_close {
					background-image: url(${require('./images/ztree/app/no_cd0fbb784.png')}) !important;
				}
				//Yahoo邮箱
				&.app_1010034_ico_docu,
				&.app_1010034_ico_open,
				&.app_1010034_ico_close {
					background-image: url(${require('./images/ztree/app/1010034.png')}) !important;
				}
				//新浪微博
				&.app_1330001_ico_docu,
				&.app_1330001_ico_open,
				&.app_1330001_ico_close {
					background-image: url(${require('./images/ztree/app/1330001.png')}) !important;
				}
				//腾讯微博
				&.app_1330002_ico_docu,
				&.app_1330002_ico_open,
				&.app_1330002_ico_close {
					background-image: url(${require('./images/ztree/app/1330002.png')}) !important;
				}
				//Twitter
				&.app_1330005_ico_docu,
				&.app_1330005_ico_open,
				&.app_1330005_ico_close {
					background-image: url(${require('./images/ztree/app/1330005.png')}) !important;
				}
				//钉钉
				&.app_1030162_ico_docu,
				&.app_1030162_ico_open,
				&.app_1030162_ico_close {
					background-image: url(${require('./images/ztree/app/1030162.png')}) !important;
				}
				//今日头条
				&.app_1380030_ico_docu,
				&.app_1380030_ico_open,
				&.app_1380030_ico_close {
					background-image: url(${require('./images/ztree/app/1380030.png')}) !important;
				}
				//哔哩哔哩（b站）
				&.app_1400024_ico_docu,
				&.app_1400024_ico_open,
				&.app_1400024_ico_close {
					background-image: url(${require('./images/ztree/app/1400024.png')}) !important;
				}
				//优酷
				&.app_1400004_ico_docu,
				&.app_1400004_ico_open,
				&.app_1400004_ico_close {
					background-image: url(${require('./images/ztree/app/1400004.png')}) !important;
				}
				//爱奇艺
				&.app_1400010_ico_docu,
				&.app_1400010_ico_open,
				&.app_1400010_ico_close {
					background-image: url(${require('./images/ztree/app/1400010.png')}) !important;
				}
				//Instagram
				&.app_1330014_ico_docu,
				&.app_1330014_ico_open,
				&.app_1330014_ico_close {
					background-image: url(${require('./images/ztree/app/1330014.png')}) !important;
				}
				//虎牙直播
				&.app_1550019_ico_docu,
				&.app_1550019_ico_open,
				&.app_1550019_ico_close {
					background-image: url(${require('./images/ztree/app/1550019.png')}) !important;
				}
				//斗鱼直播
				&.app_1550024_ico_docu,
				&.app_1550024_ico_open,
				&.app_1550024_ico_close {
					background-image: url(${require('./images/ztree/app/1550024.png')}) !important;
				}
				//百度地图
				&.app_1440004_ico_docu,
				&.app_1440004_ico_open,
				&.app_1440004_ico_close {
					background-image: url(${require('./images/ztree/app/1440004.png')}) !important;
				}
				//Google地图
				&.app_1440001_ico_docu,
				&.app_1440001_ico_open,
				&.app_1440001_ico_close {
					background-image: url(${require('./images/ztree/app/1440001.png')}) !important;
				}
				//高德地图
				&.app_1440003_ico_docu,
				&.app_1440003_ico_open,
				&.app_1440003_ico_close {
					background-image: url(${require('./images/ztree/app/1440003.png')}) !important;
				}
				//搜狗地图
				&.app_1440005_ico_docu,
				&.app_1440005_ico_open,
				&.app_1440005_ico_close {
					background-image: url(${require('./images/ztree/app/1440005.png')}) !important;
				}
				//腾讯地图
				&.app_1449998_ico_docu,
				&.app_1449998_ico_open,
				&.app_1449998_ico_close {
					background-image: url(${require('./images/ztree/app/1449998.png')}) !important;
				}
				//航旅纵横
				&.app_1260010_ico_docu,
				&.app_1260010_ico_open,
				&.app_1260010_ico_close {
					background-image: url(${require('./images/ztree/app/1260010.png')}) !important;
				}
				//滴滴打车
				&.app_1520001_ico_docu,
				&.app_1520001_ico_open,
				&.app_1520001_ico_close {
					background-image: url(${require('./images/ztree/app/1520001.png')}) !important;
				}
				//携程旅行
				&.app_1260004_ico_docu,
				&.app_1260004_ico_open,
				&.app_1260004_ico_close {
					background-image: url(${require('./images/ztree/app/1260004.png')}) !important;
				}
				//携程旅行（云）
				&.app_1230005_ico_docu,
				&.app_1230005_ico_open,
				&.app_1230005_ico_close {
					background-image: url(${require('./images/ztree/app/1230005.png')}) !important;
				}
				//铁路12306
				&.app_1260008_ico_docu,
				&.app_1260008_ico_open,
				&.app_1260008_ico_close {
					background-image: url(${require('./images/ztree/app/1260008.png')}) !important;
				}
				//铁路12306
				&.app_1230017_ico_docu,
				&.app_1230017_ico_open,
				&.app_1230017_ico_close {
					background-image: url(${require('./images/ztree/app/1230017.png')}) !important;
				}
				//曹操出行
				&.app_1520058_ico_docu,
				&.app_1520058_ico_open,
				&.app_1520058_ico_close {
					background-image: url(${require('./images/ztree/app/1520058.png')}) !important;
				}
				//航班管家
				&.app_1269997_ico_docu,
				&.app_1269997_ico_open,
				&.app_1269997_ico_close {
					background-image: url(${require('./images/ztree/app/1269997.png')}) !important;
				}
				//非常准
				&.app_1260011_ico_docu,
				&.app_1260011_ico_open,
				&.app_1260011_ico_close {
					background-image: url(${require('./images/ztree/app/1260011.png')}) !important;
				}
				//去哪儿
				&.app_1260007_ico_docu,
				&.app_1260007_ico_open,
				&.app_1260007_ico_close {
					background-image: url(${require('./images/ztree/app/1260007.png')}) !important;
				}
				//艺龙旅行
				&.app_1260006_ico_docu,
				&.app_1260006_ico_open,
				&.app_1260006_ico_close {
					background-image: url(${require('./images/ztree/app/1260006.png')}) !important;
				}
				//快滴打车
				&.app_1520002_ico_docu,
				&.app_1520002_ico_open,
				&.app_1520002_ico_close {
					background-image: url(${require('./images/ztree/app/1520002.png')}) !important;
				}
				//嘀嗒出行
				&.app_1520008_ico_docu,
				&.app_1520008_ico_open,
				&.app_1520008_ico_close {
					background-image: url(${require('./images/ztree/app/1520008.png')}) !important;
				}
				//途牛
				&.app_1230009_ico_docu,
				&.app_1230009_ico_open,
				&.app_1230009_ico_close {
					background-image: url(${require('./images/ztree/app/1230009.png')}) !important;
				}
				//华住会
				&.app_1230003_ico_docu,
				&.app_1230003_ico_open,
				&.app_1230003_ico_close {
					background-image: url(${require('./images/ztree/app/1230003.png')}) !important;
				}
				//穷游网
				&.app_1230035_ico_docu,
				&.app_1230035_ico_open,
				&.app_1230035_ico_close {
					background-image: url(${require('./images/ztree/app/1230035.png')}) !important;
				}
				//首旅如家
				&.app_1230015_ico_docu,
				&.app_1230015_ico_open,
				&.app_1230015_ico_close {
					background-image: url(${require('./images/ztree/app/1230015.png')}) !important;
				}
				//飞猪
				&.app_no_ca37b91ec_ico_docu,
				&.app_no_ca37b91ec_ico_open,
				&.app_no_ca37b91ec_ico_close {
					background-image: url(${require('./images/ztree/app/no_ca37b91ec.png')}) !important;
				}
				//booking
				&.app_no_5c8438bef_ico_docu,
				&.app_no_5c8438bef_ico_open,
				&.app_no_5c8438bef_ico_close {
					background-image: url(${require('./images/ztree/app/no_5c8438bef.png')}) !important;
				}
				//同程旅行
				&.app_1260014_ico_docu,
				&.app_1260014_ico_open,
				&.app_1260014_ico_close {
					background-image: url(${require('./images/ztree/app/1260014.png')}) !important;
				}
				//凯撒旅行
				&.app_no_b4cd0cbcd_ico_docu,
				&.app_no_b4cd0cbcd_ico_open,
				&.app_no_b4cd0cbcd_ico_close {
					background-image: url(${require('./images/ztree/app/no_b4cd0cbcd.png')}) !important;
				}
				//锦江酒店
				&.app_1230036_ico_docu,
				&.app_1230036_ico_open,
				&.app_1230036_ico_close {
					background-image: url(${require('./images/ztree/app/1230036.png')}) !important;
				}
				//华夏航空
				&.app_no_a11e862b2_ico_docu,
				&.app_no_a11e862b2_ico_open,
				&.app_no_a11e862b2_ico_close {
					background-image: url(${require('./images/ztree/app/no_a11e862b2.png')}) !important;
				}
				//祥鹏航空
				&.app_no_15c0c7408_ico_docu,
				&.app_no_15c0c7408_ico_open,
				&.app_no_15c0c7408_ico_close {
					background-image: url(${require('./images/ztree/app/no_15c0c7408.png')}) !important;
				}
				//通信行程卡
				&.app_no_54a3a5290_ico_docu,
				&.app_no_54a3a5290_ico_open,
				&.app_no_54a3a5290_ico_close {
					background-image: url(${require('./images/ztree/app/no_54a3a5290.png')}) !important;
				}
				//四川航空
				&.app_no_5e7ba26af_ico_docu,
				&.app_no_5e7ba26af_ico_open,
				&.app_no_5e7ba26af_ico_close {
					background-image: url(${require('./images/ztree/app/no_5e7ba26af.png')}) !important;
				}
				//东海航空
				&.app_no_89208ec4d_ico_docu,
				&.app_no_89208ec4d_ico_open,
				&.app_no_89208ec4d_ico_close {
					background-image: url(${require('./images/ztree/app/no_89208ec4d.png')}) !important;
				}
				//河北航空
				&.app_no_57dd8d0f5_ico_docu,
				&.app_no_57dd8d0f5_ico_open,
				&.app_no_57dd8d0f5_ico_close {
					background-image: url(${require('./images/ztree/app/no_57dd8d0f5.png')}) !important;
				}
				//厦门航空
				&.app_no_5225b093e_ico_docu,
				&.app_no_5225b093e_ico_open,
				&.app_no_5225b093e_ico_close {
					background-image: url(${require('./images/ztree/app/no_5225b093e.png')}) !important;
				}
				//江西航空
				&.app_no_7939c473a_ico_docu,
				&.app_no_7939c473a_ico_open,
				&.app_no_7939c473a_ico_close {
					background-image: url(${require('./images/ztree/app/no_7939c473a.png')}) !important;
				}
				//九元航空
				&.app_no_1c0517946_ico_docu,
				&.app_no_1c0517946_ico_open,
				&.app_no_1c0517946_ico_close {
					background-image: url(${require('./images/ztree/app/no_1c0517946.png')}) !important;
				}
				//长安航空
				&.app_no_48c48a4c3_ico_docu,
				&.app_no_48c48a4c3_ico_open,
				&.app_no_48c48a4c3_ico_close {
					background-image: url(${require('./images/ztree/app/no_48c48a4c3.png')}) !important;
				}
				//百度网盘
				&.app_1280015_ico_docu,
				&.app_1280015_ico_open,
				&.app_1280015_ico_close {
					background-image: url(${require('./images/ztree/app/1280015.png')}) !important;
				}
				//Dropbox
				&.app_1280010_ico_docu,
				&.app_1280010_ico_open,
				&.app_1280010_ico_close {
					background-image: url(${require('./images/ztree/app/1280010.png')}) !important;
				}
				//有道云笔记
				&.app_1280030_ico_docu,
				&.app_1280030_ico_open,
				&.app_1280030_ico_close {
					background-image: url(${require('./images/ztree/app/1280030.png')}) !important;
				}
				//WPS
				&.app_1280028_ico_docu,
				&.app_1280028_ico_open,
				&.app_1280028_ico_close {
					background-image: url(${require('./images/ztree/app/1280028.png')}) !important;
				}
				//印象笔记
				&.app_1280025_ico_docu,
				&.app_1280025_ico_open,
				&.app_1280025_ico_close {
					background-image: url(${require('./images/ztree/app/1280025.png')}) !important;
				}
				//随手记
				&.app_1290086_ico_docu,
				&.app_1290086_ico_open,
				&.app_1290086_ico_close {
					background-image: url(${require('./images/ztree/app/1290086.png')}) !important;
				}
				//Gitee码云
				&.app_no_00c228abf_ico_docu,
				&.app_no_00c228abf_ico_open,
				&.app_no_00c228abf_ico_close {
					background-image: url(${require('./images/ztree/app/no_00c228abf.png')}) !important;
				}
				//OneDrive
				&.app_no_b92dd0ca_ico_docu,
				&.app_no_b92dd0ca_ico_open,
				&.app_no_b92dd0ca_ico_close {
					background-image: url(${require('./images/ztree/app/b92dd0ca.png')}) !important;
				}
				//小米云
				&.app_1280032_ico_docu,
				&.app_1280032_ico_open,
				&.app_1280032_ico_close {
					background-image: url(${require('./images/ztree/app/1280032.png')}) !important;
				}
				//搜狗输入法
				&.app_1420005_ico_docu,
				&.app_1420005_ico_open,
				&.app_1420005_ico_close {
					background-image: url(${require('./images/ztree/app/1420005.png')}) !important;
				}
				//百度输入法
				&.app_1420093_ico_docu,
				&.app_1420093_ico_open,
				&.app_1420093_ico_close {
					background-image: url(${require('./images/ztree/app/1420093.png')}) !important;
				}
				//顺丰速运
				&.app_1240003_ico_docu,
				&.app_1240003_ico_open,
				&.app_1240003_ico_close {
					background-image: url(${require('./images/ztree/app/1240003.png')}) !important;
				}
				//达达快递
				&.app_1520504_ico_docu,
				&.app_1520504_ico_open,
				&.app_1520504_ico_close {
					background-image: url(${require('./images/ztree/app/d794436e.png')}) !important;
				}
				//德邦物流
				&.app_1240011_ico_docu,
				&.app_1240011_ico_open,
				&.app_1240011_ico_close {
					background-image: url(${require('./images/ztree/app/e86ae634.png')}) !important;
				}
				//丰巢
				&.app_no_f3160ec4_ico_docu,
				&.app_no_f3160ec4_ico_open,
				&.app_no_f3160ec4_ico_close {
					background-image: url(${require('./images/ztree/app/f3160ec4.png')}) !important;
				}
				//货拉拉
				&.app_1520501_ico_docu,
				&.app_1520501_ico_open,
				&.app_1520501_ico_close {
					background-image: url(${require('./images/ztree/app/0283f3ee.png')}) !important;
				}
				//中国邮政EMS
				&.app_1240001_ico_docu,
				&.app_1240001_ico_open,
				&.app_1240001_ico_close {
					background-image: url(${require('./images/ztree/app/3aa5bd84.png')}) !important;
				}
				//圆通
				&.app_1240002_ico_docu,
				&.app_1240002_ico_open,
				&.app_1240002_ico_close {
					background-image: url(${require('./images/ztree/app/4dd0d574.png')}) !important;
				}
				//中通
				&.app_1240007_ico_docu,
				&.app_1240007_ico_open,
				&.app_1240007_ico_close {
					background-image: url(${require('./images/ztree/app/5cb13d18.png')}) !important;
				}
				//申通
				&.app_1240005_ico_docu,
				&.app_1240005_ico_open,
				&.app_1240005_ico_close {
					background-image: url(${require('./images/ztree/app/f6dd1dc6.png')}) !important;
				}
				//韵达
				&.app_1240004_ico_docu,
				&.app_1240004_ico_open,
				&.app_1240004_ico_close {
					background-image: url(${require('./images/ztree/app/eb92ac10.png')}) !important;
				}
				//中国移动
				&.app_no_55877b82_ico_docu,
				&.app_no_55877b82_ico_open,
				&.app_no_55877b82_ico_close {
					background-image: url(${require('./images/ztree/app/55877b82.png')}) !important;
				}
				//中国联通
				&.app_1220018_ico_docu,
				&.app_1220018_ico_open,
				&.app_1220018_ico_close {
					background-image: url(${require('./images/ztree/app/1220018.png')}) !important;
				}
				//中国电信
				&.app_no_592dc87c_ico_docu,
				&.app_no_592dc87c_ico_open,
				&.app_no_592dc87c_ico_close {
					background-image: url(${require('./images/ztree/app/592dc87c.png')}) !important;
				}
				//脉脉
				&.app_1070109_ico_docu,
				&.app_1070109_ico_open,
				&.app_1070109_ico_close {
					background-image: url(${require('./images/ztree/app/1070109.png')}) !important;
				}
				//58同城
				&.app_1430003_ico_docu,
				&.app_1430003_ico_open,
				&.app_1430003_ico_close {
					background-image: url(${require('./images/ztree/app/1430003.png')}) !important;
				}
				//春秋航空
				&.app_1260017_ico_docu,
				&.app_1260017_ico_open,
				&.app_1260017_ico_close {
					background-image: url(${require('./images/ztree/app/1260017.png')}) !important;
				}
				//长龙航空
				&.app_no_feb8a5512_ico_docu,
				&.app_no_feb8a5512_ico_open,
				&.app_no_feb8a5512_ico_close {
					background-image: url(${require('./images/ztree/app/no_feb8a5512.png')}) !important;
				}
				//福州航空
				&.app_no_9999fbc74_ico_docu,
				&.app_no_9999fbc74_ico_open,
				&.app_no_9999fbc74_ico_close {
					background-image: url(${require('./images/ztree/app/no_9999fbc74.png')}) !important;
				}
				//昆明航空
				&.app_no_d93d3fd60_ico_docu,
				&.app_no_d93d3fd60_ico_open,
				&.app_no_d93d3fd60_ico_close {
					background-image: url(${require('./images/ztree/app/no_d93d3fd60.png')}) !important;
				}
				//中国联航
				&.app_no_d649d69b4_ico_docu,
				&.app_no_d649d69b4_ico_open,
				&.app_no_d649d69b4_ico_close {
					background-image: url(${require('./images/ztree/app/no_d649d69b4.png')}) !important;
				}
				//快递100
				&.app_1240010_ico_docu,
				&.app_1240010_ico_open,
				&.app_1240010_ico_close {
					background-image: url(${require('./images/ztree/app/1240010.png')}) !important;
				}
				//瑞丽航空
				&.app_no_eb52b2709_ico_docu,
				&.app_no_eb52b2709_ico_open,
				&.app_no_eb52b2709_ico_close {
					background-image: url(${require('./images/ztree/app/no_eb52b2709.png')}) !important;
				}
				//名片全能王
				&.app_no_c0de065b8_ico_docu,
				&.app_no_c0de065b8_ico_open,
				&.app_no_c0de065b8_ico_close {
					background-image: url(${require('./images/ztree/app/no_c0de065b8.png')}) !important;
				}
				//芒果电单车
				&.app_no_08daf782a_ico_docu,
				&.app_no_08daf782a_ico_open,
				&.app_no_08daf782a_ico_close {
					background-image: url(${require('./images/ztree/app/no_08daf782a.png')}) !important;
				}
				//青岛航空
				&.app_no_f7be193ba_ico_docu,
				&.app_no_f7be193ba_ico_open,
				&.app_no_f7be193ba_ico_close {
					background-image: url(${require('./images/ztree/app/no_f7be193ba.png')}) !important;
				}
				//天津航空
				&.app_no_58467df37_ico_docu,
				&.app_no_58467df37_ico_open,
				&.app_no_58467df37_ico_close {
					background-image: url(${require('./images/ztree/app/no_58467df37.png')}) !important;
				}
				//幸福航空
				&.app_no_0bee4bdbf_ico_docu,
				&.app_no_0bee4bdbf_ico_open,
				&.app_no_0bee4bdbf_ico_close {
					background-image: url(${require('./images/ztree/app/no_0bee4bdbf.png')}) !important;
				}
				//金鹏航空
				&.app_no_0374565c2_ico_docu,
				&.app_no_0374565c2_ico_open,
				&.app_no_0374565c2_ico_close {
					background-image: url(${require('./images/ztree/app/no_0374565c2.png')}) !important;
				}
				//扫描全能王
				&.app_no_0646457b4_ico_docu,
				&.app_no_0646457b4_ico_open,
				&.app_no_0646457b4_ico_close {
					background-image: url(${require('./images/ztree/app/no_0646457b4.png')}) !important;
				}
				//京东金融
				&.app_1290081_ico_docu,
				&.app_1290081_ico_open,
				&.app_1290081_ico_close {
					background-image: url(${require('./images/ztree/app/1290081.png')}) !important;
				}
				//拍拍贷
				&.app_1290073_ico_docu,
				&.app_1290073_ico_open,
				&.app_1290073_ico_close {
					background-image: url(${require('./images/ztree/app/1290073.png')}) !important;
				}
				//人人贷
				&.app_no_fc58816e6_ico_docu,
				&.app_no_fc58816e6_ico_open,
				&.app_no_fc58816e6_ico_close {
					background-image: url(${require('./images/ztree/app/no_fc58816e6.png')}) !important;
				}
				//宜人贷
				&.app_1290084_ico_docu,
				&.app_1290084_ico_open,
				&.app_1290084_ico_close {
					background-image: url(${require('./images/ztree/app/1290084.png')}) !important;
				}
				//闪电借款
				&.app_no_cf0e29fcf_ico_docu,
				&.app_no_cf0e29fcf_ico_open,
				&.app_no_cf0e29fcf_ico_close {
					background-image: url(${require('./images/ztree/app/no_cf0e29fcf.png')}) !important;
				}
				//玖富万卡
				&.app_no_02b6c9910_ico_docu,
				&.app_no_02b6c9910_ico_open,
				&.app_no_02b6c9910_ico_close {
					background-image: url(${require('./images/ztree/app/no_02b6c9910.png')}) !important;
				}
				//借贷宝
				&.app_no_9699a030b_ico_docu,
				&.app_no_9699a030b_ico_open,
				&.app_no_9699a030b_ico_close {
					background-image: url(${require('./images/ztree/app/no_9699a030b.png')}) !important;
				}
				//挖财快贷
				&.app_no_d0e8bb672_ico_docu,
				&.app_no_d0e8bb672_ico_open,
				&.app_no_d0e8bb672_ico_close {
					background-image: url(${require('./images/ztree/app/no_d0e8bb672.png')}) !important;
				}
				//好分期
				&.app_no_c38a9dc30_ico_docu,
				&.app_no_c38a9dc30_ico_open,
				&.app_no_c38a9dc30_ico_close {
					background-image: url(${require('./images/ztree/app/no_c38a9dc30.png')}) !important;
				}
				//途虎养车
				&.app_no_bf401e9d2_ico_docu,
				&.app_no_bf401e9d2_ico_open,
				&.app_no_bf401e9d2_ico_close {
					background-image: url(${require('./images/ztree/app/no_bf401e9d2.png')}) !important;
				}
				//汽车之家
				&.app_1070110_ico_docu,
				&.app_1070110_ico_open,
				&.app_1070110_ico_close {
					background-image: url(${require('./images/ztree/app/1070110.png')}) !important;
				}
				//最右
				&.app_1400037_ico_docu,
				&.app_1400037_ico_open,
				&.app_1400037_ico_close {
					background-image: url(${require('./images/ztree/app/1400037.png')}) !important;
				}
				//百度hi
				&.app_1030037_ico_docu,
				&.app_1030037_ico_open,
				&.app_1030037_ico_close {
					background-image: url(${require('./images/ztree/app/1030037.png')}) !important;
				}
				//赫兹
				&.app_no_ec3d9f4f_ico_docu,
				&.app_no_ec3d9f4f_ico_open,
				&.app_no_ec3d9f4f_ico_close {
					background-image: url(${require('./images/ztree/app/no_ec3d9f4f.png')}) !important;
				}
				//币信
				&.app_no_6ae88f64_ico_docu,
				&.app_no_6ae88f64_ico_open,
				&.app_no_6ae88f64_ico_close {
					background-image: url(${require('./images/ztree/app/no_6ae88f64.png')}) !important;
				}
				//爱聊
				&.app_1030077_ico_docu,
				&.app_1030077_ico_open,
				&.app_1030077_ico_close {
					background-image: url(${require('./images/ztree/app/1030077.png')}) !important;
				}
				//兼课招聘
				&.app_no_1c8a839de_ico_docu,
				&.app_no_1c8a839de_ico_open,
				&.app_no_1c8a839de_ico_close {
					background-image: url(${require('./images/ztree/app/no_1c8a839de.png')}) !important;
				}
				//海投网
				&.app_no_3d067208f_ico_docu,
				&.app_no_3d067208f_ico_open,
				&.app_no_3d067208f_ico_close {
					background-image: url(${require('./images/ztree/app/no_3d067208f.png')}) !important;
				}
				//梧桐果
				&.app_no_ef21634ee_ico_docu,
				&.app_no_ef21634ee_ico_open,
				&.app_no_ef21634ee_ico_close {
					background-image: url(${require('./images/ztree/app/no_ef21634ee.png')}) !important;
				}
				//智通人才网
				&.app_no_0f9fad1ec_ico_docu,
				&.app_no_0f9fad1ec_ico_open,
				&.app_no_0f9fad1ec_ico_close {
					background-image: url(${require('./images/ztree/app/no_0f9fad1ec.png')}) !important;
				}
				//BOSS直聘
				&.app_no_b5978d5ba_ico_docu,
				&.app_no_b5978d5ba_ico_open,
				&.app_no_b5978d5ba_ico_close {
					background-image: url(${require('./images/ztree/app/no_b5978d5ba.png')}) !important;
				}
				//店长直聘
				&.app_1300034_ico_docu,
				&.app_1300034_ico_open,
				&.app_1300034_ico_close {
					background-image: url(${require('./images/ztree/app/1300034.png')}) !important;
				}
				//猎聘
				&.app_1300031_ico_docu,
				&.app_1300031_ico_open,
				&.app_1300031_ico_close {
					background-image: url(${require('./images/ztree/app/1300031.png')}) !important;
				}
				//前程无忧
				&.app_1300020_ico_docu,
				&.app_1300020_ico_open,
				&.app_1300020_ico_close {
					background-image: url(${require('./images/ztree/app/1300020.png')}) !important;
				}
				//智联招聘
				&.app_1300999_ico_docu,
				&.app_1300999_ico_open,
				&.app_1300999_ico_close {
					background-image: url(${require('./images/ztree/app/1300999.png')}) !important;
				}
				//贵州航空
				&.app_no_3c6b8f2a2_ico_docu,
				&.app_no_3c6b8f2a2_ico_open,
				&.app_no_3c6b8f2a2_ico_close {
					background-image: url(${require('./images/ztree/app/no_3c6b8f2a2.png')}) !important;
				}
				//哈啰出行
				&.app_no_6a7079a86_ico_docu,
				&.app_no_6a7079a86_ico_open,
				&.app_no_6a7079a86_ico_close {
					background-image: url(${require('./images/ztree/app/no_6a7079a86.png')}) !important;
				}
				//米家
				&.app_no_e8c6b0d6_ico_docu,
				&.app_no_e8c6b0d6_ico_open,
				&.app_no_e8c6b0d6_ico_close {
					background-image: url(${require('./images/ztree/app/no_e8c6b0d6.png')}) !important;
				}
				//迅雷
				&.app_1400011_ico_docu,
				&.app_1400011_ico_open,
				&.app_1400011_ico_close {
					background-image: url(${require('./images/ztree/app/1400011.png')}) !important;
				}
				//百度
				&.app_1250002_ico_docu,
				&.app_1250002_ico_open,
				&.app_1250002_ico_close {
					background-image: url(${require('./images/ztree/app/1250002.png')}) !important;
				}
				//ICQ
				&.app_1030002_ico_docu,
				&.app_1030002_ico_open,
				&.app_1030002_ico_close {
					background-image: url(${require('./images/ztree/app/1030002.png')}) !important;
				}
				//tango
				&.app_1030086_ico_docu,
				&.app_1030086_ico_open,
				&.app_1030086_ico_close {
					background-image: url(${require('./images/ztree/app/1030086.png')}) !important;
				}
				//360
				&.app_1030139_ico_docu,
				&.app_1030139_ico_open,
				&.app_1030139_ico_close {
					background-image: url(${require('./images/ztree/app/1030139.png')}) !important;
				}
				//mico
				&.app_1030145_ico_docu,
				&.app_1030145_ico_open,
				&.app_1030145_ico_close {
					background-image: url(${require('./images/ztree/app/1030145.png')}) !important;
				}
				//百度糯米
				&.app_1220014_ico_docu,
				&.app_1220014_ico_open,
				&.app_1220014_ico_close {
					background-image: url(${require('./images/ztree/app/1220014.png')}) !important;
				}
				//360云盘
				&.app_1280003_ico_docu,
				&.app_1280003_ico_open,
				&.app_1280003_ico_close {
					background-image: url(${require('./images/ztree/app/1280003.png')}) !important;
				}
				//同花顺
				&.app_1290076_ico_docu,
				&.app_1290076_ico_open,
				&.app_1290076_ico_close {
					background-image: url(${require('./images/ztree/app/1290076.png')}) !important;
				}
				//360借条
				&.app_1290079_ico_docu,
				&.app_1290079_ico_open,
				&.app_1290079_ico_close {
					background-image: url(${require('./images/ztree/app/1290079.png')}) !important;
				}
				//东方财富
				&.app_1290080_ico_docu,
				&.app_1290080_ico_open,
				&.app_1290080_ico_close {
					background-image: url(${require('./images/ztree/app/1290080.png')}) !important;
				}
				//一点资讯
				&.app_1380038_ico_docu,
				&.app_1380038_ico_open,
				&.app_1380038_ico_close {
					background-image: url(${require('./images/ztree/app/1380038.png')}) !important;
				}
				//百度音乐
				&.app_1390002_ico_docu,
				&.app_1390002_ico_open,
				&.app_1390002_ico_close {
					background-image: url(${require('./images/ztree/app/1390002.png')}) !important;
				}
				//好看视频
				&.app_1400046_ico_docu,
				&.app_1400046_ico_open,
				&.app_1400046_ico_close {
					background-image: url(${require('./images/ztree/app/1400046.png')}) !important;
				}
				//安居客
				&.app_no_0f3b505e_ico_docu,
				&.app_no_0f3b505e_ico_open,
				&.app_no_0f3b505e_ico_close {
					background-image: url(${require('./images/ztree/app/no_0f3b505e.png')}) !important;
				}
				//MIUI论坛
				&.app_no_1add9855_ico_docu,
				&.app_no_1add9855_ico_open,
				&.app_no_1add9855_ico_close {
					background-image: url(${require('./images/ztree/app/no_1add9855.png')}) !important;
				}
				//vivo云服务
				&.app_no_2f49105ec_ico_docu,
				&.app_no_2f49105ec_ico_open,
				&.app_no_2f49105ec_ico_close {
					background-image: url(${require('./images/ztree/app/no_2f49105ec.png')}) !important;
				}
				//鲁大师
				&.app_no_3cf7b6bc_ico_docu,
				&.app_no_3cf7b6bc_ico_open,
				&.app_no_3cf7b6bc_ico_close {
					background-image: url(${require('./images/ztree/app/no_3cf7b6bc.png')}) !important;
				}
				//天眼查
				&.app_no_6bde41af_ico_docu,
				&.app_no_6bde41af_ico_open,
				&.app_no_6bde41af_ico_close {
					background-image: url(${require('./images/ztree/app/no_6bde41af.png')}) !important;
				}
				//鄂汇办
				&.app_no_6e9b8369_ico_docu,
				&.app_no_6e9b8369_ico_open,
				&.app_no_6e9b8369_ico_close {
					background-image: url(${require('./images/ztree/app/no_6e9b8369.png')}) !important;
				}
				//军之梦
				&.app_no_7d1e4f91_ico_docu,
				&.app_no_7d1e4f91_ico_open,
				&.app_no_7d1e4f91_ico_close {
					background-image: url(${require('./images/ztree/app/no_7d1e4f91.png')}) !important;
				}
				//WIFI万能钥匙
				&.app_no_9aaf41b9_ico_docu,
				&.app_no_9aaf41b9_ico_open,
				&.app_no_9aaf41b9_ico_close {
					background-image: url(${require('./images/ztree/app/no_9aaf41b9.png')}) !important;
				}
				//百度文库
				&.app_no_9b591b9f_ico_docu,
				&.app_no_9b591b9f_ico_open,
				&.app_no_9b591b9f_ico_close {
					background-image: url(${require('./images/ztree/app/no_9b591b9f.png')}) !important;
				}
				//搜狗
				&.app_no_10d247e0_ico_docu,
				&.app_no_10d247e0_ico_open,
				&.app_no_10d247e0_ico_close {
					background-image: url(${require('./images/ztree/app/no_10d247e0.png')}) !important;
				}
				//人人视频
				&.app_no_13c8770d_ico_docu,
				&.app_no_13c8770d_ico_open,
				&.app_no_13c8770d_ico_close {
					background-image: url(${require('./images/ztree/app/no_13c8770d.png')}) !important;
				}
				//智学网
				&.app_no_29b3e4bd_ico_docu,
				&.app_no_29b3e4bd_ico_open,
				&.app_no_29b3e4bd_ico_close {
					background-image: url(${require('./images/ztree/app/no_29b3e4bd.png')}) !important;
				}
				//雪球
				&.app_no_37f3d5eb_ico_docu,
				&.app_no_37f3d5eb_ico_open,
				&.app_no_37f3d5eb_ico_close {
					background-image: url(${require('./images/ztree/app/no_37f3d5eb.png')}) !important;
				}
				//酷我音乐
				&.app_no_46b02df1_ico_docu,
				&.app_no_46b02df1_ico_open,
				&.app_no_46b02df1_ico_close {
					background-image: url(${require('./images/ztree/app/no_46b02df1.png')}) !important;
				}
				//企查查
				&.app_no_76c5d9be_ico_docu,
				&.app_no_76c5d9be_ico_open,
				&.app_no_76c5d9be_ico_close {
					background-image: url(${require('./images/ztree/app/no_76c5d9be.png')}) !important;
				}
				//小米随星借
				&.app_no_98b71c0a_ico_docu,
				&.app_no_98b71c0a_ico_open,
				&.app_no_98b71c0a_ico_close {
					background-image: url(${require('./images/ztree/app/no_98b71c0a.png')}) !important;
				}
				//美图秀秀
				&.app_no_293a792e_ico_docu,
				&.app_no_293a792e_ico_open,
				&.app_no_293a792e_ico_close {
					background-image: url(${require('./images/ztree/app/no_293a792e.png')}) !important;
				}
				//咪咕音乐
				&.app_no_394d0713_ico_docu,
				&.app_no_394d0713_ico_open,
				&.app_no_394d0713_ico_close {
					background-image: url(${require('./images/ztree/app/no_394d0713.png')}) !important;
				}
				//小米音箱
				&.app_no_662b4e1d_ico_docu,
				&.app_no_662b4e1d_ico_open,
				&.app_no_662b4e1d_ico_close {
					background-image: url(${require('./images/ztree/app/no_662b4e1d.png')}) !important;
				}
				//360摄像头
				&.app_no_942b3a6a_ico_docu,
				&.app_no_942b3a6a_ico_open,
				&.app_no_942b3a6a_ico_close {
					background-image: url(${require('./images/ztree/app/no_942b3a6a.png')}) !important;
				}
				//有钱花
				&.app_no_1230fb5a_ico_docu,
				&.app_no_1230fb5a_ico_open,
				&.app_no_1230fb5a_ico_close {
					background-image: url(${require('./images/ztree/app/no_1230fb5a.png')}) !important;
				}
				//书旗
				&.app_no_02672db6_ico_docu,
				&.app_no_02672db6_ico_open,
				&.app_no_02672db6_ico_close {
					background-image: url(${require('./images/ztree/app/no_02672db6.png')}) !important;
				}
				//enigma
				&.app_no_90954349_ico_docu,
				&.app_no_90954349_ico_open,
				&.app_no_90954349_ico_close {
					background-image: url(${require('./images/ztree/app/no_90954349.png')}) !important;
				}
				//8181军人网
				&.app_no_a1d6bfc8_ico_docu,
				&.app_no_a1d6bfc8_ico_open,
				&.app_no_a1d6bfc8_ico_close {
					background-image: url(${require('./images/ztree/app/no_a1d6bfc8.png')}) !important;
				}
				//学而思
				&.app_no_a6b0fe1f_ico_docu,
				&.app_no_a6b0fe1f_ico_open,
				&.app_no_a6b0fe1f_ico_close {
					background-image: url(${require('./images/ztree/app/no_a6b0fe1f.png')}) !important;
				}
				//快看漫画
				&.app_no_bb186476_ico_docu,
				&.app_no_bb186476_ico_open,
				&.app_no_bb186476_ico_close {
					background-image: url(${require('./images/ztree/app/no_bb186476.png')}) !important;
				}
				//360手机卫士
				&.app_no_bc6a49fc_ico_docu,
				&.app_no_bc6a49fc_ico_open,
				&.app_no_bc6a49fc_ico_close {
					background-image: url(${require('./images/ztree/app/no_bc6a49fc.png')}) !important;
				}
				//美篇
				&.app_no_c66c6fc5_ico_docu,
				&.app_no_c66c6fc5_ico_open,
				&.app_no_c66c6fc5_ico_close {
					background-image: url(${require('./images/ztree/app/no_c66c6fc5.png')}) !important;
				}
				//度小满金融
				&.app_no_cd0b7dca_ico_docu,
				&.app_no_cd0b7dca_ico_open,
				&.app_no_cd0b7dca_ico_close {
					background-image: url(${require('./images/ztree/app/no_cd0b7dca.png')}) !important;
				}
				//4399小游戏
				&.app_no_d1d5ed73_ico_docu,
				&.app_no_d1d5ed73_ico_open,
				&.app_no_d1d5ed73_ico_close {
					background-image: url(${require('./images/ztree/app/no_d1d5ed73.png')}) !important;
				}
				//链家
				&.app_no_d3ca73fb_ico_docu,
				&.app_no_d3ca73fb_ico_open,
				&.app_no_d3ca73fb_ico_close {
					background-image: url(${require('./images/ztree/app/no_d3ca73fb.png')}) !important;
				}
				//mchat
				&.app_no_f8ad1b18_ico_docu,
				&.app_no_f8ad1b18_ico_open,
				&.app_no_f8ad1b18_ico_close {
					background-image: url(${require('./images/ztree/app/no_f8ad1b18.png')}) !important;
				}
				//芒果TV
				&.app_no_f12da117_ico_docu,
				&.app_no_f12da117_ico_open,
				&.app_no_f12da117_ico_close {
					background-image: url(${require('./images/ztree/app/no_f12da117.png')}) !important;
				}
				//百度输入法
				&.app_no_f507414b_ico_docu,
				&.app_no_f507414b_ico_open,
				&.app_no_f507414b_ico_close {
					background-image: url(${require('./images/ztree/app/no_f507414b.png')}) !important;
				}
				//美拍
				&.app_no_fa5c5b2c_ico_docu,
				&.app_no_fa5c5b2c_ico_open,
				&.app_no_fa5c5b2c_ico_close {
					background-image: url(${require('./images/ztree/app/no_fa5c5b2c.png')}) !important;
				}
				//乐视视频
				&.app_no_fa38d4d7_ico_docu,
				&.app_no_fa38d4d7_ico_open,
				&.app_no_fa38d4d7_ico_close {
					background-image: url(${require('./images/ztree/app/no_fa38d4d7.png')}) !important;
				}
				//2345网
				&.app_no_fa0572cf_ico_docu,
				&.app_no_fa0572cf_ico_open,
				&.app_no_fa0572cf_ico_close {
					background-image: url(${require('./images/ztree/app/no_fa0572cf.png')}) !important;
				}
				//飞书
				&.app_no_7714e5cf_ico_docu,
				&.app_no_7714e5cf_ico_open,
				&.app_no_7714e5cf_ico_close {
					background-image: url(${require('./images/ztree/app/no_7714e5cf.png')}) !important;
				}
				//深圳航空
				&.app_no_dc42972b_ico_docu,
				&.app_no_dc42972b_ico_open,
				&.app_no_dc42972b_ico_close {
					background-image: url(${require('./images/ztree/app/no_dc42972b.png')}) !important;
				}
				//T3出行
				&.app_no_360d65e4_ico_docu,
				&.app_no_360d65e4_ico_open,
				&.app_no_360d65e4_ico_close {
					background-image: url(${require('./images/ztree/app/no_360d65e4.png')}) !important;
				}
				//趣约会
				&.app_no_bf4e4fe7_ico_docu,
				&.app_no_bf4e4fe7_ico_open,
				&.app_no_bf4e4fe7_ico_close {
					background-image: url(${require('./images/ztree/app/no_bf4e4fe7.png')}) !important;
				}
				//ImToken
				&.app_no_505eb4b7_ico_docu,
				&.app_no_505eb4b7_ico_open,
				&.app_no_505eb4b7_ico_close {
					background-image: url(${require('./images/ztree/app/no_505eb4b7.png')}) !important;
				}
				//火币
				&.app_no_e4f28dec_ico_docu,
				&.app_no_e4f28dec_ico_open,
				&.app_no_e4f28dec_ico_close {
					background-image: url(${require('./images/ztree/app/no_e4f28dec.png')}) !important;
				}
				//币安
				&.app_no_439b85b3_ico_docu,
				&.app_no_439b85b3_ico_open,
				&.app_no_439b85b3_ico_close {
					background-image: url(${require('./images/ztree/app/no_439b85b3.png')}) !important;
				}
				//伊对
				&.app_no_d06d6474_ico_docu,
				&.app_no_d06d6474_ico_open,
				&.app_no_d06d6474_ico_close {
					background-image: url(${require('./images/ztree/app/no_d06d6474.png')}) !important;
				}
				//Bib
				&.app_no_e70473d2_ico_docu,
				&.app_no_e70473d2_ico_open,
				&.app_no_e70473d2_ico_close {
					background-image: url(${require('./images/ztree/app/no_e70473d2.png')}) !important;
				}
				//陌单
				&.app_no_398cce84_ico_docu,
				&.app_no_398cce84_ico_open,
				&.app_no_398cce84_ico_close {
					background-image: url(${require('./images/ztree/app/no_398cce84.png')}) !important;
				}
				//SSR
				&.app_no_1c16e694_ico_docu,
				&.app_no_1c16e694_ico_open,
				&.app_no_1c16e694_ico_close {
					background-image: url(${require('./images/ztree/app/no_1c16e694.png')}) !important;
				}
				//旋风加速器
				&.app_no_716c64da_ico_docu,
				&.app_no_716c64da_ico_open,
				&.app_no_716c64da_ico_close {
					background-image: url(${require('./images/ztree/app/no_716c64da.png')}) !important;
				}

				//? 补图标
				//keep
				&.app_6f88451f_ico_docu,
				&.app_6f88451f_ico_open,
				&.app_6f88451f_ico_close {
					background-image: url(${require('./images/ztree/app/6f88451f.png')}) !important;
				}
				//有货
				&.app_0aa34fd8_ico_docu,
				&.app_0aa34fd8_ico_open,
				&.app_0aa34fd8_ico_close {
					background-image: url(${require('./images/ztree/app/0aa34fd8.png')}) !important;
				}
				//QQ音乐
				&.app_a90d8a34_ico_docu,
				&.app_a90d8a34_ico_open,
				&.app_a90d8a34_ico_close {
					background-image: url(${require('./images/ztree/app/a90d8a34.png')}) !important;
				}
				//薄荷健康
				&.app_b2f494a4_ico_docu,
				&.app_b2f494a4_ico_open,
				&.app_b2f494a4_ico_close {
					background-image: url(${require('./images/ztree/app/b2f494a4.png')}) !important;
				}
				//彩云天气
				&.app_bf976298_ico_docu,
				&.app_bf976298_ico_open,
				&.app_bf976298_ico_close {
					background-image: url(${require('./images/ztree/app/bf976298.png')}) !important;
				}
				//豆瓣FM
				&.app_95d710ec_ico_docu,
				&.app_95d710ec_ico_open,
				&.app_95d710ec_ico_close {
					background-image: url(${require('./images/ztree/app/95d710ec.png')}) !important;
				}
				//MONO
				&.app_bd31ec6e_ico_docu,
				&.app_bd31ec6e_ico_open,
				&.app_bd31ec6e_ico_close {
					background-image: url(${require('./images/ztree/app/bd31ec6e.png')}) !important;
				}
				//测网速
				&.app_2fb124cd_ico_docu,
				&.app_2fb124cd_ico_open,
				&.app_2fb124cd_ico_close {
					background-image: url(${require('./images/ztree/app/2fb124cd.png')}) !important;
				}
				//黄油相机
				&.app_23809ae9_ico_docu,
				&.app_23809ae9_ico_open,
				&.app_23809ae9_ico_close {
					background-image: url(${require('./images/ztree/app/23809ae9.png')}) !important;
				}
				//简书
				&.app_bae35e5c_ico_docu,
				&.app_bae35e5c_ico_open,
				&.app_bae35e5c_ico_close {
					background-image: url(${require('./images/ztree/app/bae35e5c.png')}) !important;
				}
				//夸克
				&.app_631cb0d0_ico_docu,
				&.app_631cb0d0_ico_open,
				&.app_631cb0d0_ico_close {
					background-image: url(${require('./images/ztree/app/631cb0d0.png')}) !important;
				}
				//一个
				&.app_0c8be8e9_ico_docu,
				&.app_0c8be8e9_ico_open,
				&.app_0c8be8e9_ico_close {
					background-image: url(${require('./images/ztree/app/0c8be8e9.png')}) !important;
				}
				//作业帮
				&.app_e992379f_ico_docu,
				&.app_e992379f_ico_open,
				&.app_e992379f_ico_close {
					background-image: url(${require('./images/ztree/app/e992379f.png')}) !important;
				}
				//掌上公交
				&.app_8a1870be_ico_docu,
				&.app_8a1870be_ico_open,
				&.app_8a1870be_ico_close {
					background-image: url(${require('./images/ztree/app/8a1870be.png')}) !important;
				}
				//堆糖
				&.app_4a039630_ico_docu,
				&.app_4a039630_ico_open,
				&.app_4a039630_ico_close {
					background-image: url(${require('./images/ztree/app/4a039630.png')}) !important;
				}
				//即刻
				&.app_e9696d87_ico_docu,
				&.app_e9696d87_ico_open,
				&.app_e9696d87_ico_close {
					background-image: url(${require('./images/ztree/app/e9696d87.png')}) !important;
				}
				//下厨房
				&.app_177bb6dd_ico_docu,
				&.app_177bb6dd_ico_open,
				&.app_177bb6dd_ico_close {
					background-image: url(${require('./images/ztree/app/177bb6dd.png')}) !important;
				}
				//番茄小说
				&.app_3e9a1c21_ico_docu,
				&.app_3e9a1c21_ico_open,
				&.app_3e9a1c21_ico_close {
					background-image: url(${require('./images/ztree/app/3e9a1c21.png')}) !important;
				}
				//招商银行
				&.app_cecd0e22_ico_docu,
				&.app_cecd0e22_ico_open,
				&.app_cecd0e22_ico_close {
					background-image: url(${require('./images/ztree/app/cecd0e22.png')}) !important;
				}
				//书旗小说
				&.app_ed6d1626_ico_docu,
				&.app_ed6d1626_ico_open,
				&.app_ed6d1626_ico_close {
					background-image: url(${require('./images/ztree/app/ed6d1626.png')}) !important;
				}
				//熊猫看书
				&.app_04b928a3_ico_docu,
				&.app_04b928a3_ico_open,
				&.app_04b928a3_ico_close {
					background-image: url(${require('./images/ztree/app/04b928a3.png')}) !important;
				}
				//风行视频
				&.app_aeaadd32_ico_docu,
				&.app_aeaadd32_ico_open,
				&.app_aeaadd32_ico_close {
					background-image: url(${require('./images/ztree/app/aeaadd32.png')}) !important;
				}
				//咪咕阅读
				&.app_b4ff0174_ico_docu,
				&.app_b4ff0174_ico_open,
				&.app_b4ff0174_ico_close {
					background-image: url(${require('./images/ztree/app/b4ff0174.png')}) !important;
				}
				//毒舌影视
				&.app_7cdd8983_ico_docu,
				&.app_7cdd8983_ico_open,
				&.app_7cdd8983_ico_close {
					background-image: url(${require('./images/ztree/app/7cdd8983.png')}) !important;
				}
				//儿歌多多
				&.app_dcf02120_ico_docu,
				&.app_dcf02120_ico_open,
				&.app_dcf02120_ico_close {
					background-image: url(${require('./images/ztree/app/dcf02120.png')}) !important;
				}
				//口袋记帐
				&.app_637cb79b_ico_docu,
				&.app_637cb79b_ico_open,
				&.app_637cb79b_ico_close {
					background-image: url(${require('./images/ztree/app/637cb79b.png')}) !important;
				}
				//知趣天气
				&.app_80f5481d_ico_docu,
				&.app_80f5481d_ico_open,
				&.app_80f5481d_ico_close {
					background-image: url(${require('./images/ztree/app/80f5481d.png')}) !important;
				}
				//时光网
				&.app_daa96402_ico_docu,
				&.app_daa96402_ico_open,
				&.app_daa96402_ico_close {
					background-image: url(${require('./images/ztree/app/daa96402.png')}) !important;
				}
				//相机360
				&.app_eff32995_ico_docu,
				&.app_eff32995_ico_open,
				&.app_eff32995_ico_close {
					background-image: url(${require('./images/ztree/app/eff32995.png')}) !important;
				}
				//闪玩
				&.app_aff617f5_ico_docu,
				&.app_aff617f5_ico_open,
				&.app_aff617f5_ico_close {
					background-image: url(${require('./images/ztree/app/aff617f5.png')}) !important;
				}
				//滴答清单
				&.app_f7e61062_ico_docu,
				&.app_f7e61062_ico_open,
				&.app_f7e61062_ico_close {
					background-image: url(${require('./images/ztree/app/f7e61062.png')}) !important;
				}
				//广发证券易淘金
				&.app_573587e4_ico_docu,
				&.app_573587e4_ico_open,
				&.app_573587e4_ico_close {
					background-image: url(${require('./images/ztree/app/573587e4.png')}) !important;
				}
				//荐片播放器
				&.app_53f803f9_ico_docu,
				&.app_53f803f9_ico_open,
				&.app_53f803f9_ico_close {
					background-image: url(${require('./images/ztree/app/53f803f9.png')}) !important;
				}
				//开眼
				&.app_c4ed0b58_ico_docu,
				&.app_c4ed0b58_ico_open,
				&.app_c4ed0b58_ico_close {
					background-image: url(${require('./images/ztree/app/c4ed0b58.png')}) !important;
				}
				//荔枝
				&.app_aad96cae_ico_docu,
				&.app_aad96cae_ico_open,
				&.app_aad96cae_ico_close {
					background-image: url(${require('./images/ztree/app/aad96cae.png')}) !important;
				}
				//录屏大师
				&.app_81b31417_ico_docu,
				&.app_81b31417_ico_open,
				&.app_81b31417_ico_close {
					background-image: url(${require('./images/ztree/app/81b31417.png')}) !important;
				}
				//每日瑜伽
				&.app_80a7ff23_ico_docu,
				&.app_80a7ff23_ico_open,
				&.app_80a7ff23_ico_close {
					background-image: url(${require('./images/ztree/app/80a7ff23.png')}) !important;
				}
				//美丽修行
				&.app_54973b86_ico_docu,
				&.app_54973b86_ico_open,
				&.app_54973b86_ico_close {
					background-image: url(${require('./images/ztree/app/54973b86.png')}) !important;
				}
				//美食杰
				&.app_ef191319_ico_docu,
				&.app_ef191319_ico_open,
				&.app_ef191319_ico_close {
					background-image: url(${require('./images/ztree/app/ef191319.png')}) !important;
				}
				//手机管家
				&.app_9e31dab6_ico_docu,
				&.app_9e31dab6_ico_open,
				&.app_9e31dab6_ico_close {
					background-image: url(${require('./images/ztree/app/9e31dab6.png')}) !important;
				}
				//小猿搜题
				&.app_69907c12_ico_docu,
				&.app_69907c12_ico_open,
				&.app_69907c12_ico_close {
					background-image: url(${require('./images/ztree/app/69907c12.png')}) !important;
				}
				//行程助手
				&.app_5f240bf7_ico_docu,
				&.app_5f240bf7_ico_open,
				&.app_5f240bf7_ico_close {
					background-image: url(${require('./images/ztree/app/5f240bf7.png')}) !important;
				}
				//洋葱浏览器
				&.app_06639e49_ico_docu,
				&.app_06639e49_ico_open,
				&.app_06639e49_ico_close {
					background-image: url(${require('./images/ztree/app/06639e49.png')}) !important;
				}
				//易企秀
				&.app_4d387ab0_ico_docu,
				&.app_4d387ab0_ico_open,
				&.app_4d387ab0_ico_close {
					background-image: url(${require('./images/ztree/app/4d387ab0.png')}) !important;
				}
				//猿题库
				&.app_2af8ff72_ico_docu,
				&.app_2af8ff72_ico_open,
				&.app_2af8ff72_ico_close {
					background-image: url(${require('./images/ztree/app/2af8ff72.png')}) !important;
				}
				//猿题库
				&.app_2af8ff72_ico_docu,
				&.app_2af8ff72_ico_open,
				&.app_2af8ff72_ico_close {
					background-image: url(${require('./images/ztree/app/2af8ff72.png')}) !important;
				}
				//悦动圈
				&.app_cf48ac96_ico_docu,
				&.app_cf48ac96_ico_open,
				&.app_cf48ac96_ico_close {
					background-image: url(${require('./images/ztree/app/cf48ac96.png')}) !important;
				}
				//悦跑圈
				&.app_a7bb55a7_ico_docu,
				&.app_a7bb55a7_ico_open,
				&.app_a7bb55a7_ico_close {
					background-image: url(${require('./images/ztree/app/a7bb55a7.png')}) !important;
				}
				//B612咔叽
				&.app_77653a80_ico_docu,
				&.app_77653a80_ico_open,
				&.app_77653a80_ico_close {
					background-image: url(${require('./images/ztree/app/77653a80.png')}) !important;
				}
				//IT之家
				&.app_8e3f5069_ico_docu,
				&.app_8e3f5069_ico_open,
				&.app_8e3f5069_ico_close {
					background-image: url(${require('./images/ztree/app/8e3f5069.png')}) !important;
				}
				//度小满金融
				&.app_5c088b53_ico_docu,
				&.app_5c088b53_ico_open,
				&.app_5c088b53_ico_close {
					background-image: url(${require('./images/ztree/app/5c088b53.png')}) !important;
				}
				//烘焙帮
				&.app_2a54976c_ico_docu,
				&.app_2a54976c_ico_open,
				&.app_2a54976c_ico_close {
					background-image: url(${require('./images/ztree/app/2a54976c.png')}) !important;
				}
				//交通银行
				&.app_63a4da59_ico_docu,
				&.app_63a4da59_ico_open,
				&.app_63a4da59_ico_close {
					background-image: url(${require('./images/ztree/app/63a4da59.png')}) !important;
				}
				//酷家乐设计师
				&.app_25030a7f_ico_docu,
				&.app_25030a7f_ico_open,
				&.app_25030a7f_ico_close {
					background-image: url(${require('./images/ztree/app/25030a7f.png')}) !important;
				}
				//夸克扫描王
				&.app_b59cf187_ico_docu,
				&.app_b59cf187_ico_open,
				&.app_b59cf187_ico_close {
					background-image: url(${require('./images/ztree/app/b59cf187.png')}) !important;
				}
				//驴妈妈旅游
				&.app_2f05a876_ico_docu,
				&.app_2f05a876_ico_open,
				&.app_2f05a876_ico_close {
					background-image: url(${require('./images/ztree/app/2f05a876.png')}) !important;
				}
				//平安证券
				&.app_40332f1c_ico_docu,
				&.app_40332f1c_ico_open,
				&.app_40332f1c_ico_close {
					background-image: url(${require('./images/ztree/app/40332f1c.png')}) !important;
				}
				//糗事百科
				&.app_ae0a88c0_ico_docu,
				&.app_ae0a88c0_ico_open,
				&.app_ae0a88c0_ico_close {
					background-image: url(${require('./images/ztree/app/ae0a88c0.png')}) !important;
				}
				//天天P图
				&.app_ef0282a6_ico_docu,
				&.app_ef0282a6_ico_open,
				&.app_ef0282a6_ico_close {
					background-image: url(${require('./images/ztree/app/ef0282a6.png')}) !important;
				}
				//蜗牛睡眠
				&.app_1bc10822_ico_docu,
				&.app_1bc10822_ico_open,
				&.app_1bc10822_ico_close {
					background-image: url(${require('./images/ztree/app/1bc10822.png')}) !important;
				}
				//无他相机
				&.app_59ee0bcf_ico_docu,
				&.app_59ee0bcf_ico_open,
				&.app_59ee0bcf_ico_close {
					background-image: url(${require('./images/ztree/app/59ee0bcf.png')}) !important;
				}
				//无他相机
				&.app_59ee0bcf_ico_docu,
				&.app_59ee0bcf_ico_open,
				&.app_59ee0bcf_ico_close {
					background-image: url(${require('./images/ztree/app/59ee0bcf.png')}) !important;
				}
				//有道翻译官
				&.app_5f145e7e_ico_docu,
				&.app_5f145e7e_ico_open,
				&.app_5f145e7e_ico_close {
					background-image: url(${require('./images/ztree/app/5f145e7e.png')}) !important;
				}
				//中公网校
				&.app_6bd8aae0_ico_docu,
				&.app_6bd8aae0_ico_open,
				&.app_6bd8aae0_ico_close {
					background-image: url(${require('./images/ztree/app/6bd8aae0.png')}) !important;
				}
				//花椒直播
				&.app_22f119de_ico_docu,
				&.app_22f119de_ico_open,
				&.app_22f119de_ico_close {
					background-image: url(${require('./images/ztree/app/22f119de.png')}) !important;
				}
				//交管12123
				&.app_909b2e70_ico_docu,
				&.app_909b2e70_ico_open,
				&.app_909b2e70_ico_close {
					background-image: url(${require('./images/ztree/app/909b2e70.png')}) !important;
				}
				//邮储银行
				&.app_13721252_ico_docu,
				&.app_13721252_ico_open,
				&.app_13721252_ico_close {
					background-image: url(${require('./images/ztree/app/13721252.png')}) !important;
				}
				//兴业银行
				&.app_5895e4bc_ico_docu,
				&.app_5895e4bc_ico_open,
				&.app_5895e4bc_ico_close {
					background-image: url(${require('./images/ztree/app/5895e4bc.png')}) !important;
				}
				//悟空浏览器
				&.app_ec3b7294_ico_docu,
				&.app_ec3b7294_ico_open,
				&.app_ec3b7294_ico_close {
					background-image: url(${require('./images/ztree/app/ec3b7294.png')}) !important;
				}
				//腾讯视频
				&.app_6b24068a_ico_docu,
				&.app_6b24068a_ico_open,
				&.app_6b24068a_ico_close {
					background-image: url(${require('./images/ztree/app/6b24068a.png')}) !important;
				}
				//拉勾招聘
				&.app_b030b761_ico_docu,
				&.app_b030b761_ico_open,
				&.app_b030b761_ico_close {
					background-image: url(${require('./images/ztree/app/b030b761.png')}) !important;
				}
				//华夏银行
				&.app_2d16415a_ico_docu,
				&.app_2d16415a_ico_open,
				&.app_2d16415a_ico_close {
					background-image: url(${require('./images/ztree/app/2d16415a.png')}) !important;
				}
				//搜狐新闻
				&.app_86787198_ico_docu,
				&.app_86787198_ico_open,
				&.app_86787198_ico_close {
					background-image: url(${require('./images/ztree/app/86787198.png')}) !important;
				}
				//Snapdrop
				&.app_7d833861_ico_docu,
				&.app_7d833861_ico_open,
				&.app_7d833861_ico_close {
					background-image: url(${require('./images/ztree/app/7d833861.png')}) !important;
				}
				//ZAKER
				&.app_82f49c63_ico_docu,
				&.app_82f49c63_ico_open,
				&.app_82f49c63_ico_close {
					background-image: url(${require('./images/ztree/app/82f49c63.png')}) !important;
				}
				//大象新闻
				&.app_05efccb2_ico_docu,
				&.app_05efccb2_ico_open,
				&.app_05efccb2_ico_close {
					background-image: url(${require('./images/ztree/app/05efccb2.png')}) !important;
				}
				//个人所得税
				&.app_3162e330_ico_docu,
				&.app_3162e330_ico_open,
				&.app_3162e330_ico_close {
					background-image: url(${require('./images/ztree/app/3162e330.png')}) !important;
				}
				//极客空间
				&.app_93763751_ico_docu,
				&.app_93763751_ico_open,
				&.app_93763751_ico_close {
					background-image: url(${require('./images/ztree/app/93763751.png')}) !important;
				}
				//金色财经
				&.app_edb950d2_ico_docu,
				&.app_edb950d2_ico_open,
				&.app_edb950d2_ico_close {
					background-image: url(${require('./images/ztree/app/edb950d2.png')}) !important;
				}
				//央视频
				&.app_2af44832_ico_docu,
				&.app_2af44832_ico_open,
				&.app_2af44832_ico_close {
					background-image: url(${require('./images/ztree/app/2af44832.png')}) !important;
				}
				//看准
				&.app_3a8146c4_ico_docu,
				&.app_3a8146c4_ico_open,
				&.app_3a8146c4_ico_close {
					background-image: url(${require('./images/ztree/app/3a8146c4.png')}) !important;
				}
				//小蓝鸟
				&.app_abcccd33_ico_docu,
				&.app_abcccd33_ico_open,
				&.app_abcccd33_ico_close {
					background-image: url(${require('./images/ztree/app/abcccd33.png')}) !important;
				}
				//微信读书
				&.app_2186feb9_ico_docu,
				&.app_2186feb9_ico_open,
				&.app_2186feb9_ico_close {
					background-image: url(${require('./images/ztree/app/2186feb9.png')}) !important;
				}
				//懂车帝
				&.app_4836f603_ico_docu,
				&.app_4836f603_ico_open,
				&.app_4836f603_ico_close {
					background-image: url(${require('./images/ztree/app/4836f603.png')}) !important;
				}
				//讯飞输入法
				&.app_4289f57d_ico_docu,
				&.app_4289f57d_ico_open,
				&.app_4289f57d_ico_close {
					background-image: url(${require('./images/ztree/app/4289f57d.png')}) !important;
				}
			}
		}
	}
}
`;

export { GlobalStyle };
