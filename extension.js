var vscode = require('vscode');
var advTitleListTag = '<!--webbot bot="AdvTitleList" nodeid="{nodeid}" type="" spanmode="0" isshowcode="0" dayspan="{dayspan}" attr="{attr}" comstring="{comstring}" TAG="BODY" PREVIEW="-" startspan --><!--webbot bot="AdvTitleList" endspan i-checksum="0" -->';
var advTitleListPageTag = '<!--webbot bot="AdvTitleListPage" nodeid="{nodeid}" type="" spanmode="{spanmode}" dayspan="{dayspan}" attr="{attr}" comstring="{comstring}" pagenumstyle="" pageprefix="" pagepostfix="" pageturnoverstyle="" firstpage="" curpage="" finallypage="" lastpage="{lastpage}" nextpage="{nextpage}" isshow="0" isshowcode="1" TAG="BODY" PREVIEW="-" startspan --><!--webbot bot="AdvTitleListPage" endspan i-checksum="0" -->';
var advContentTag = '<!--webbot bot="AdvContent" comstring="{comstring}" typeid="-1" pagenumstyle="" pageprefix="" pagepostfix="" pageturnoverstyle="" firstpage="" curpage="" finallypage="" lastpage="{lastpage}" nextpage="{nextpage}" isshow="0" isshowcode="0" TAG="BODY" PREVIEW="-"  startspan --><!--webbot bot="AdvContent" endspan i-checksum="0" -->';
var singleNodeTag = '<!--webbot bot="SingleNode" style="A:#IMAGE:#FONT:#TARGET:{target}" nodeid="{nodeid}" szinfo="" TAG="BODY" PREVIEW="-" startspan --><!--webbot bot="SingleNode" endspan i-checksum="0" -->';
var selectionType = [{
		label: '标题',
		description: '<Title length="0">TitlePh</Title>'
	}, {
		label: '副题',
		description: '<Subtitle>SubtitlePh</Subtitle>'
	}, {
		label: '引题',
		description: '<PreTitle>PreTitlePh</PreTitle>'
	}, {
		label: '摘要',
		description: '<Abstract>AbstractPh</Abstract>'
	}, {
		label: '标题图片',
		description: '<Picture><img src="PictureUrlPh" /></Picture>'
	}, {
		label: '正文',
		description: '<Content>ContentPh</Content>'
	}, {
		label: '关键字',
		description: '<Keyword>KeywordPh</Keyword>'
	}, {
		label: '编辑',
		description: '<Editor>EditorPh</Editor>'
	}, {
		label: '责任编辑',
		description: '<Liability>LiabilityPh</Liability>'
	}, {
		label: '来源',
		description: '<Source>SourcePh</Source>'
	}, {
		label: '文章链接',
		description: '<Url><a href="ArticleUrlPh" target="_blank"></Url>{selectionText}</a>'
	}, {
		label: '发布时间',
		description: '<PubTime Language=1 BriefMonth=0 BriefWeek=0> YearPh-MonthPh-DayPh HourPh:MinutePh:SecondPh WeekPh </PubTime>'
	}, {
		label: '稿件',
		description: '<Article>{selectionText}</Article>'
	}, {
		label: '循环',
		description: '<Repeat Begin=0 End=0>{selectionText}</Repeat>'
	}];

//页面插入方正标签
function advTag(data) {
	var editor = vscode.window.activeTextEditor;
	var founderTag = '';
	if(data['tagName'] == 'AdvTitleListTag') {
		founderTag = template(advTitleListTag,data);
	}
	if(data['tagName'] == 'AdvTitleListPageTag') {
		founderTag = template(advTitleListPageTag,data);
	}
	if(data['tagName'] == 'AdvContentTag') {
		founderTag = template(advContentTag,data);
	}
	if(data['tagName'] == 'SingleNodeTag') {
		founderTag = template(singleNodeTag,data);
	}
	vscode.window.setStatusBarMessage(data['alt'] + '成功！', 5000);
	editor.edit(editr => editr.replace(editor.selection, founderTag));
}

//编辑方正标签路由
function editRoute(type) {
	var editor = vscode.window.activeTextEditor;
  var selection = editor.selection,
		selectionText = editor.document.getText(selection),
		reg = new RegExp('^<!--webbot([\\s\\S]*?)i-checksum="0" -->$'),
		isfounderTag = reg.test(selectionText);
  if (!isfounderTag) {
    vscode.window.showInformationMessage('你选择的不是方正标签。');
    return;
  }
	var founderTypeData = getFounderType(selectionText);
	switch (type) {
    case "attr":
      edit_Attr(founderTypeData);
      break;
		case "nodeid":
			edit_Nodeid(founderTypeData);
			break;
		case "dayspan":
			edit_Dayspan(founderTypeData);
			break;
		case "comstring":
			edit_Comstring(founderTypeData);
			break;
  }
}

//编辑Html片段代码
function edit_Comstring(data) {
	var defaultData = {
		'tagName': '',
		'alt': '',
		'founderAttr': {}
	};
	vscode.window.showInputBox({'prompt': '填写编码过的Html片段代码', 'value': data['comstring']}).then(selectValue => {
		defaultData['tagName'] = data['bot'] + 'Tag';
		defaultData['alt'] = '编辑成功！';
		defaultData['founderAttr'] = data;
		if (selectValue) {
      //选择了属性
			defaultData['founderAttr']['comstring'] = selectValue;
      advTag(defaultData);
    } else {
      //未选择属性
      defaultData['founderAttr']['comstring'] = data['comstring'];
      advTag(defaultData);
    }
	});
}

//编辑标题列表总条数或分页标题列表页条数
function edit_Dayspan(data) {
	console.log(data);
	var defaultData = {
		'tagName': '',
		'alt': '',
		'founderAttr': {}
	};
	vscode.window.showInputBox({'prompt': '编辑标题列表条数或分页标题列表页数', 'value': data['dayspan']}).then(selectValue => {
		defaultData['tagName'] = data['bot'] + 'Tag';
		defaultData['alt'] = '编辑成功！';
		defaultData['founderAttr'] = data;
    if (selectValue) {
      //选择了属性
			defaultData['founderAttr']['dayspan'] = selectValue;
      advTag(defaultData);
    } else {
      //未选择属性
      defaultData['founderAttr']['dayspan'] = data['dayspan'];
      advTag(defaultData);
    }
	});
}

//编辑方正栏目ID
function edit_Nodeid(data) {
	var defaultData = {
		'tagName': '',
		'alt': '',
		'founderAttr': {}
	};
	vscode.window.showInputBox({'prompt': '指定栏目ID', 'value': data['nodeid']}).then(selectValue => {
		defaultData['tagName'] = data['bot'] + 'Tag';
		defaultData['alt'] = '编辑成功！';
		defaultData['founderAttr'] = data;
    if (selectValue) {
      //选择了属性
			defaultData['founderAttr']['nodeid'] = selectValue;
      advTag(defaultData);
    } else {
      //未选择属性
      defaultData['founderAttr']['nodeid'] = data['nodeid'];
      advTag(defaultData);
    }
	});
}

//编辑方正文章属性
function edit_Attr(data) {
  var articleType = [];
	var defaultData = {
		'tagName': '',
		'alt': '',
		'founderAttr': {}
	};
  ['图片', '头条', '普通', '重要', '其它'].forEach(function (el, id) {
		articleType.push({
			label: el,
			description: '+' + (61 + id)
		});
  });

  vscode.window.showQuickPick(articleType, { placeHolder: '稿件属性' }).then(selectValue => {
		defaultData['tagName'] = data['bot'] + 'Tag';
		defaultData['alt'] = '编辑成功！';
		defaultData['founderAttr'] = data;
    if (selectValue) {
      //选择了属性
			defaultData['founderAttr']['attr'] = selectValue['description'];
      advTag(defaultData);
    } else {
      //未选择属性
      defaultData['founderAttr']['attr'] = data['attr'];
      advTag(defaultData);
    }
  });
}

//方正标签关键字段
function htmlInsertAttr() {
	var editor = vscode.window.activeTextEditor;
	var selection = editor.selection,
			selectionText = editor.document.getText(selection);
	vscode.window.showQuickPick(selectionType, { placeHolder: '稿件属性' }).then(selectValue => {
		var str = selectValue['description'].replace(/{[^]+}/, selectionText);
		editor.edit(editr => editr.replace(selection, str));
	});
}

//方正标签编码
function htmlCode(str) {
	var editor = vscode.window.activeTextEditor;
	var selection = editor.selection,
			selectionText = editor.document.getText(selection),
			temp = selectionText;
	if (selectionText.length == 0) { return ""; }
	if(str == "encode") {
		//编码
		temp = temp.replace(/&/g, "&amp;");
		temp = temp.replace(/</g, "&lt;");
		temp = temp.replace(/>/g, "&gt;");
		temp = temp.replace(/"/g, "#enpquot#");
	}
	if(str == "decode") {
		//解码
		temp = temp.replace(/&amp;/g, "&");
		temp = temp.replace(/&lt;/g, "<");
		temp = temp.replace(/&gt;/g, ">");
		temp = temp.replace(/#enpquot#/g, '"');
	}
	editor.edit(editr => editr.replace(selection, temp));
}

//获取方正标签类型
function getFounderType(str) {
	var ptn = new RegExp('([a-zA-Z-]*?="[\\s\\S]*?")', 'g'),
		ptn_attr = new RegExp('([^=]*?)="([\\s\\S]*?)"'),
		arr = str.match(ptn),
		founder_tag_attr = {},
		digest_arr;
	for (var i in arr) {
		digest_arr = arr[i].match(ptn_attr);
		founder_tag_attr[digest_arr[1]] = digest_arr[2];
	}
	return founder_tag_attr;
}

//模板数据合成
function template(tpl,data) {
	var reg = new RegExp('{([^}]+)}', 'img');
	var match = tpl.match(reg);
	for(var i=0;i<match.length;i++) {
		var str = match[i].replace("{", "");
		str = str.replace("}","");
		tpl = tpl.replace(match[i],data['founderAttr'][str]);
	}
	return tpl;
}

function activate(context) {
	var founderDataDefault = {
		'tagName': '',
		'alt': '',
		'founderAttr': {
			'nodeid': '',
			'attr': '',
			'dayspan': '0',
			'spanmode': '0',
			'lastpage': '上一页',
			'nextpage': '下一页',
			'target': '_blank',
			'comstring': ''
		}
	};
	vscode.commands.registerCommand('founder.singleNode', function () {
		founderDataDefault['tagName'] = 'SingleNodeTag';
		founderDataDefault['alt'] = '添加方正单个栏目';
		advTag(founderDataDefault);
	});
	vscode.commands.registerCommand('founder.advTitleList', function () {
		founderDataDefault['tagName'] = 'AdvTitleListTag';
		founderDataDefault['alt'] = '添加方正标题列表';
		advTag(founderDataDefault);
	});
	vscode.commands.registerCommand('founder.advTitleListPage', function () {
		founderDataDefault['tagName'] = 'AdvTitleListPageTag';
		founderDataDefault['alt'] = '添加方正分页标题列表';
		advTag(founderDataDefault);
	});
	vscode.commands.registerCommand('founder.advContent', function () {
		founderDataDefault['tagName'] = 'AdvContentTag';
		founderDataDefault['alt'] = '添加方正文章内容';
		advTag(founderDataDefault);
	});
	vscode.commands.registerCommand('founder.editAttr', function () {
		//编辑方正文章属性
		editRoute("attr");
	});
	vscode.commands.registerCommand('founder.editNodeid', function () {
		//编辑方正栏目ID
		editRoute("nodeid");
	});
	vscode.commands.registerCommand('founder.editDayspan', function () {
		//编辑标题列表条数或分页标题列表页数
		editRoute("dayspan");
	});
	vscode.commands.registerCommand('founder.editComstring', function () {
		//编辑Html片段代码
		editRoute("comstring");
	});
	vscode.commands.registerCommand('founder.htmlEncode', function () {
		//方正标签编码
		htmlCode("encode");
	});
	vscode.commands.registerCommand('founder.htmlDecode', function () {
		//方正标签解码
		htmlCode("decode");
	});
	vscode.commands.registerCommand('founder.htmlInsertAttr', function () {
		//方正标签关键字段
		htmlInsertAttr();
	});
	//context.subscriptions.push('founder.editDayspan');
}
exports.activate = activate;