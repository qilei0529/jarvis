jarvis
======

a lite web rebuild server base on nodejs

jarvis目前是一个轻量级的前端重构开发系统。

===

**名字由来：**

jarvis 是钢铁侠Iron man里 的Tony制造的那台超级电脑的名字。它帮助Tony完成了繁琐的计算和运算。

###基本功能

1. 本地重构环境。支持html模板，less等。


###开发中的功能

1. 支持文件编译。支持html合并输出，less合并输出及压缩。
2. 支持Host代理环境。支持 域名代理，文件夹代理，单文件代理。


====


###使用方法

**安装**

在使用之前需要你的机子安装node环境，然后进行以下步骤

	git clone git://github.com/qilei0529/jarvis.git

如果没有git可以点击下载zip包解压在本地。

	cd jarvis

安装依赖库 安装一些 javis 需要的node组件如：less等。
	
	npm install

复制一份配置文件成 config.js -- (配置请参考底下 config.js 说明)

	cp config.js.sample config.js

运行jarvis

	node bin/jarvis
	
这个时候会提示。一些使用方法 如 build, help , server等 

运行 server

	node bin/jarvis server


**本地环境**

上面的工作做完后 打开浏览器 输入 localhost:8888 (默认8888 端口)

就可以看到你在 config.js 中设置的根目录。



====

###config.js 说明

端口

	port: 8888,

根目录

	root: '/Users/qilei/code',


node日志：默认不显示，目前没啥用。(调试node的时候使用)

	//logger: 'dev',
	
hosts 配置，指定域名指向到特定目录。

	hosts: {
		'www.jarvis.com': {
			root: '/Users/bencode/webroot/jarvis'
		}
	}


###特性说明



