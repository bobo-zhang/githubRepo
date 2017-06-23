		//用户名：
		var  usernameRegex = /^\w{5,15}$/;
		//密码：
		var passwordRegex = /^\w{8,12}$/;
		//手机号：
		var telRegex = /^1[34578]\d{9}$/;
		//邮箱：
		var emailRegex = /^\w+@\w+(\.\w+)+$/;
		//责任人：
		var realNameRegex = /^[\u4e00-\u9fa5]{2,5}$/;
		//企业名称：
		var enterpriseNameRegex = /^[\u4e00-\u9fa5]{2,15}$/;
		var flag = true;
		
		function validateForm(){ //定义validateForm方法用于客户端校验
			
			//校验用户名
			var usernameNode = byId("userNameId"); //获得ID值为username的节点对象
			var usernameId = usernameNode.value;   //获得usernameNode节点的值，即用户在username文本框内填写的值
			if(!usernameRegex.test(usernameId)){    //验证获得到的值是否符合正则表达式
				byId("usernameId_span").style.color = "red"; //如果不符合，则将ID值为username_span的节点对象内容变为红色
				flag = false;        //返回false，不提交
			}
			
			//校验密码
			var passwordNode = byId("password");  //获得ID值为password的节点对象
			var password = passwordNode.value;
			if(!passwordRegex.test(password)){
				byId("password_span").style.color = "red";
				flag = false;
			}
			
			//确认密码
			var rePasswordNode = byId("rePassword");  //获得ID值为rePassword的节点对象
			var rePassword = rePasswordNode.value;
			if(!password==rePassword){
				byId("rePassword_span").style.color = "red";
				flag = false;
			}else if(!passwordRegex.test(rePassword)){
				byId("rePassword_span").style.color = "red";
				flag = false;
			}else{
				byId("rePassword_span").style.display = "none";
			}
			
			//校验责任人
			var userNameNode = byId("userName");  //获得ID值为realName的节点对象
			var userName = userNameNode.value;
			if(!realNameRegex.test(userName)){
				byId("userName_span").style.color = "red";
				flag = false;
			}
			
			//校验联系方式
			var telNode = byId("tel");  //获得ID值为Email的节点对象
			var tel = telNode.value;
			if(!telRegex.test(tel)){
				byId("tel_span").style.color = "red";
				flag = false;
			}
			
			//校验邮箱
			var emailNode = byId("email");  //获得ID值为Email的节点对象
			var email = emailNode.value;
			if(!emailRegex.test(email)){
				byId("Email_span").style.color = "red";
				flag = false;
			}
			
			//校验企业名称
			var enterpriseNameNode = byId("enterpriseName");  //获得ID值为realName的节点对象
			var enterpriseName = enterpriseNameNode.value;
			if(!enterpriseNameRegex.test(enterpriseName)){
				byId("enterpriseNameRegex_span").style.color = "red";
				flag = false;
			}
			
			//校验身份
			var roleNode = byId("role");  //获得ID值为province的节点对象
			var role = roleNode.value;
			if("--请选择--" == role){
				byId("role_span").style.color = "red";
				flag = false;
			}

			return flag;
		}
			
		function byId(id){  //自定义方法，用于获取传递过来的ID值对应的节点对象
			return document.getElementById(id);
		}
			
		function checkUsernameId(node){ //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//校验用户名
			var usernameId = node.value;  //得到传递过来的节点对象的值
			if(!usernameRegex.test(usernameId)){  //验证是否符合节点对应的正则表达式
				byId("usernameId_span").style.color = "red";
				byId("usernameId_span").style.display = "inline";	//不符合，相应内容变成红色
			}else{
				byId("usernameId_span").style.display = "none";
				//符合，相应内容消失
			}
		}
		
		function checkPassword(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//校验密码
			var password = node.value;
			if (!passwordRegex.test(password)) {
				byId("password_span").style.color = "red";
				byId("password_span").style.display = "inline";
			}
			else {
				byId("password_span").style.display = "none";
			}
		}	
			
		function checkRePassword(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//确认密码				
			var rePassword = node.value;
			var password = byId("password").value;			
			if(password!==rePassword){
				byId("rePassword_span").style.display = "inline";					
				byId("rePassword_span").style.color = "red";		
			}else if(!passwordRegex.test(rePassword)){
				byId("rePassword_span").style.color = "red";
				byId("rePassword_span").style.display = "inline";
			}else{
				byId("rePassword_span").style.display = "none";
			}
		}		

		function checkuserName(node){ //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//校验用户名
			var username = node.value;  //得到传递过来的节点对象的值
			if(!realNameRegex.test(username)){  //验证是否符合节点对应的正则表达式
				byId("userName_span").style.color = "red";
				byId("userName_span").style.display = "inline";	//不符合，相应内容变成红色
			}else{
				byId("userName_span").style.display = "none";
				//符合，相应内容消失
			}
		}
		
		function checkTel(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//校验联系方式
			var tel = node.value;
			if(!telRegex.test(tel)){
				byId("tel_span").style.color = "red";
				byId("tel_span").style.display = "inline";
			}else{
				byId("tel_span").style.display = "none";
			}
		}
		
		function checkEmail(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			//校验邮箱
			var email = node.value;
			if(!emailRegex.test(email)){
				byId("Email_span").style.color = "red";
				byId("Email_span").style.display = "inline";
			}else{
				byId("Email_span").style.display = "none";
			}
		}
			
		function checkenterpriseName(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			var enterpriseName = node.value;
			if(!enterpriseNameRegex.test(enterpriseName)){
				byId("enterpriseName_span").style.color = "red";
				byId("enterpriseName_span").style.display = "inline";
			}else{
				byId("enterpriseName_span").style.display = "none";
			}
		}
		
		function checkRole(node){  //当鼠标离开节点时调用此方法，验证节点内容是否符合注册规范
			var role = node.value;
			if("--请选择--" == role){
				byId("role_span").style.color = "red";
				byId("role_span").style.display = "inline";
			}else{
				byId("role_span").style.display = "none";
			}
		}
		

