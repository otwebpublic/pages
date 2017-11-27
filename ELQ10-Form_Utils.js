/* OT Marketing Ops shared E10 script for Eloqua Forms and Pages - Part 1 - UTILITIES / Prerequisites (no cookies required or set)
updated with new GA account and new Demandbase script (Eloqua use only)
updated to only insert scripts for Eloqua hosted subdomains (WEM has its own GA which inserts Demandbase) 
2017-03-30 */

	var origStates = null;
	var PrefRequest = null;
   	var btnSubmit = null;
	var isExpSubscribed = false;
	/* overridable, just assign any value externally */
    var DefaultCampaignId;
	var PrefReqMsgOverride;
	var PrefReqLangOverride;
	var wasInitOptIn=false;
	
	var provMap = [['US',[['AK','Alaska'],['AL','Alabama'],['AR','Arkansas'],['AZ','Arizona'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DC','District of Columbia'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['IA','Iowa'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['MA','Massachusetts'],['MD','Maryland'],['ME','Maine'],['MI','Michigan'],['MN','Minnesota'],['MO','Missouri'],['MS','Mississippi'],['MT','Montana'],['NC','North Carolina'],['ND','North Dakota'],['NE','Nebraska'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NV','Nevada'],['NY','New York'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['PR','Puerto Rico'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['DC','Washington D.C.'],['WI','Wisconsin'],['WV','West Virginia'],['WY','Wyoming']]],['CA',[['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],['NL','Newfoundland'],['NS','Nova Scotia'],['NT','Northwest Territories'],['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],['SK','Saskatchewan'],['YT','Yukon']]],['AU',[['NSW','New South Wales'],['NT','Northern Territory'],['QLD','Queensland'],['SA','South Australia'],['TAS','Tasmania'],['VIC','Victoria'],['WA','Western Australia']]]];
	
	//0=AMER,1=APAC,2=EUROPE,3=FGM
	var regionMap = [['AD',2],['AE',3],['AF',3],['AG',3],['AI',3],['AL',3],['AM',3],['AN',3],['AO',3],['AQ',3],['AR',3],['AS',1],['AT',2],['AU',1],['AW',3],['AX',3],['AZ',3],['BA',3],['BB',3],['BD',1],['BE',2],['BF',3],['BG',3],['BH',3],['BI',3],['BJ',3],['BL',3],['BM',3],['BN',3],['BO',3],['BQ',2],['BR',3],['BS',3],['BT',1],['BV',3],['BW',3],['BY',3],['BZ',3],['CA',0],['CC',1],['CD',3],['CF',3],['CG',3],['CH',2],['CI',3],['CK',1],['CL',3],['CM',3],['CN',3],['CO',3],['CR',3],['CU',3],['CV',3],['CW',3],['CX',1],['CY',3],['CZ',3],['DE',2],['DJ',3],['DK',2],['DM',3],['DO',3],['DZ',3],['EC',3],['EE',3],['EG',3],['EH',3],['ER',3],['ES',2],['ET',3],['FI',2],['FJ',1],['FK',3],['FM',1],['FO',3],['FR',2],['GA',3],['GB',2],['GD',3],['GE',3],['GF',3],['GG',2],['GH',3],['GI',2],['GL',2],['GM',3],['GN',3],['GP',3],['GQ',3],['GR',3],['GS',3],['GT',3],['GU',3],['GW',3],['GY',3],['HK',1],['HM',1],['HN',3],['HR',3],['HT',3],['HU',3],['ID',1],['IE',2],['IL',3],['IM',3],['IN',3],['IO',1],['IQ',3],['IR',3],['IS',3],['IT',2],['JE',2],['JM',3],['JO',3],['JP',3],['KE',3],['KG',3],['KH',1],['KI',1],['KM',3],['KN',3],['KP',1],['KR',1],['KW',3],['KY',3],['KZ',1],['LA',1],['LB',3],['LC',3],['LI',2],['LK',1],['LR',3],['LS',3],['LT',3],['LU',2],['LV',3],['LY',3],['MA',3],['MC',3],['MD',3],['ME',3],['MF',3],['MG',3],['MH',1],['MK',3],['ML',3],['MM',1],['MN',1],['MO',1],['MP',1],['MQ',3],['MR',3],['MS',3],['MT',3],['MU',1],['MV',1],['MW',3],['MX',3],['MY',1],['MZ',3],['NA',3],['NC',1],['NE',3],['NF',1],['NG',3],['NI',3],['NL',2],['NO',2],['NP',3],['NR',1],['NU',1],['NZ',1],['OM',3],['PA',3],['PE',3],['PF',1],['PG',1],['PH',1],['PK',1],['PL',3],['PM',3],['PN',1],['PR',3],['PS',3],['PT',2],['PW',1],['PY',3],['QA',3],['RE',1],['RO',3],['RS',3],['RU',3],['RW',3],['SA',3],['SB',1],['SC',1],['SD',3],['SE',2],['SG',1],['SH',3],['SI',3],['SJ',3],['SK',3],['SL',3],['SM',3],['SN',3],['SO',3],['SR',3],['ST',3],['SV',3],['SX',3],['SY',3],['SZ',3],['TC',3],['TD',3],['TF',3],['TG',3],['TH',1],['TJ',3],['TK',1],['TL',1],['TM',3],['TN',3],['TO',1],['TR',3],['TT',3],['TV',1],['TW',1],['TZ',3],['UA',3],['UG',3],['UM',3],['US',0],['UY',3],['UZ',3],['VA',2],['VC',3],['VE',3],['VG',3],['VI',3],['VN',1],['VU',1],['WF',1],['WS',1],['YE',3],['YT',3],['YU',3],['ZA',3],['ZM',3],['ZR',3],['ZW',3]];

	//obtain first one that matches name
	function getOne(tName){
		var rList=null;		
		rList=document.getElementsByName(tName);
		if(rList!==null && rList.length>0) return rList[0];
		else return null;
	}

    //try to read a personalization value from a DL returned function
    function readVal(tVal){
        if(typeof GetElqContentPersonalizationValue=="function") return GetElqContentPersonalizationValue(tVal);
        else return "";
    }

    //update the input matching the id provided with the value provided
    function setVal(tInputId,tVal){
        var targetInput=null;

        if (tInputId!=null && tInputId.length>0){
			targetInput=getOne(tInputId);
            if(targetInput && tVal.length>0) targetInput.value = tVal;
        }
    }
    
    //function that reads a parameter from the URL if available
	function readURLParam(tParamName)
	{
		var curPair;
		var paramArray = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

		for(var i = 0; i < paramArray.length; i++){
			curPair = paramArray[i].split('=');
			if(curPair.length>1 && curPair[0].toLowerCase()==tParamName.toLowerCase()) return curPair[1];
		}
		
		return "";
	}
	
	//functions to show/hide field region
	function HideRegForFieldName(tFName){
		var tField=null;
		if(tFName && tFName.length>0) tField = getOne(tFName);
		HideRegForField(tField);
	}
	function HideRegForField(tF){		
		if(tF) HideRegForJQField(jQuery(tF));
	}
	function HideRegForJQField(tJQF){
		if(tJQF) tJQF.closest("div").parent().parent().hide();
	}
	function ShowRegForJQField(tJQF){
		if(tJQF) tJQF.closest("div").parent().parent().show();
	}
		
	//form handlers that are not prepop/cookie dependent
	function PrepHandlers1(){		
		var oCountry=getOne("country");
		if(oCountry!==null) jQuery(oCountry).change(DetermineStateProvVis);
		
		//hide state area first, disable input
		var oState=getOne('stateProv');
		if(oState!==null){
			//force livevalidation due to Eloqua update
			if(typeof LiveValidation==="function"){
				var stateProvVal  = new LiveValidation(oState, {validMessage: "", onlyOnBlur: false, wait: 300});
				stateProvVal.add(Validate.Presence, {failureMessage:"This field is required"});
				
				//ensure asterisk present. jQuery(getOne("stateProv")).parent().find('span.required').length
				if(jQuery(getOne("stateProv")).parent().find('label').find('span').length===0)jQuery(getOne("stateProv")).parent().children().first().append('<span class=required>*</span>');
			}
			
			jQuery(oState).attr("disabled","disabled");
			HideRegForField(oState);
		}
	}
	
    function ensureHiddenField(fieldName, fieldValue){
		var tField = null;
		var sibling = null;
		
		if(fieldName!=null && fieldName.length>0){
			tField = getOne(fieldName);
			sibling = jQuery(getOne("elqFormName"));
			
			if(sibling.length>0){
				if(tField===null){
					if(sibling.length>0) sibling.after("<input type=hidden name="+fieldName+" value="+fieldValue+">");
				}else setVal(fieldName,fieldValue);
			}
		}
	}
	
    //see if campaign id should be updated from value map (if defined/provided)
	function mapBUCampaign(srcMap){
	  var isMatch=false;
	  var curPos=0;
	  
	  if(jQuery.isArray(srcMap) && srcMap.length>0){
		  while(!isMatch && curPos<=srcMap.length-1){
			  if(document.referrer.indexOf(srcMap[curPos][0])>=0){
				  isMatch=true;
				  setVal("elqCampaignId",srcMap[curPos][1]);
			  }
			  curPos++;
		  }
	  }      
	}
	
    //Try to set the hidden fields if their values are available, or default to value if provided one (campaing id only)
    function SetCampaignId(){
	  //initially set to default if available
	  if(DefaultCampaignId && DefaultCampaignId.length>0) setVal("elqCampaignId",DefaultCampaignId);
	  
	  //try to override from URL
      var curCID = readURLParam("elqCampaignId");
      if(curCID && curCID.length>0) setVal("elqCampaignId",curCID);
	  else if(typeof BUCampaignIDMap !== "undefined") mapBUCampaign(BUCampaignIDMap);//no id in URL, see if there is a referrer map
	  
	  ensureHiddenField("PageURL",document.URL);
	  ensureHiddenField("Referrer",document.referrer);
    }
	
	//locate submit button for adding optin chkbox and industry catchall
	//btnSubmit is a global variable
	function findSubmitBtn(){
		var tFormNameIn=null;
		if(typeof btnSubmit!=="undefined" && btnSubmit==null){
			tFormNameIn=getOne("elqFormName");
			if(tFormNameIn!==null){ 
				btnSubmit=jQuery(tFormNameIn).closest("form").find("input.submit-button");
				if(btnSubmit.length<=0) btnSubmit=jQuery(tFormNameIn).closest("form").find("input[type=submit]");
				if(btnSubmit.length<=0) btnSubmit=null;
			}
		}
	}
	
	//determine if domain is not Eloqua hosted before using 3rd party tracking script
	function ThirdPartyTracked(){
		var tracked = true;	
		//ignore for eloqua hosted pages already tracked via image
		if(window.location.hostname.indexOf("campaigns.")>=0) tracked=false;
		else if(window.location.hostname.indexOf("campaigns-")>=0) tracked=false;
		else if(window.location.hostname.indexOf("subscriptions.")>=0) tracked=false;	
		return tracked;
	}
	
	//inject opt-in checkbox
	function InitOptIn(tCountry)
	{
		wasInitOptIn=true;//global flag
		var PrefRequestHTML='';
		var PrefReqMsg=" I am interested in receiving targeted and relevant communications from OpenText. A confirmation email will be sent to confirm my subscription.";
		var PrefReqLang="EN";
		var tFormNameIn=null;
		
		if(tCountry==="CA") PrefReqMsg="By checking this box I confirm that I would like to receive personalized communications and information from Open Text Corporation, <a href='http://www.opentext.com'>www.opentext.com</a>, 275 Frank Tompa Drive, Waterloo, ON, Canada, N2L 0A1.  I understand that I may withdraw my consent at any time.";//canada message is now different
		if(PrefReqMsgOverride && PrefReqMsgOverride.length>0) PrefReqMsg=PrefReqMsgOverride;
		if(PrefReqLangOverride && PrefReqLangOverride.length>0) PrefReqLang=PrefReqLangOverride;
	
		PrefRequestHTML = '<div id="PreferenceRequest" style="display:none;" class="PrefReqLP"><input id=PreferenceRequest-FORMS value="'+PrefReqLang+'" style="" type=checkbox name=PreferenceRequest-FORMS class="PrefReqInputLP"><label class=PrefReqLblLP for=PreferenceRequest-FORMS>'+PrefReqMsg+'</label><div style="clear:both;"></div></div>';
		
		PrefRequest = document.getElementById("PreferenceRequest");
		findSubmitBtn();
		if (btnSubmit && PrefRequest===null){
			if(PrefRequestHTML) btnSubmit.closest('div').before(PrefRequestHTML);
			PrefRequest = document.getElementById("PreferenceRequest");
			
			//remove existing E10 hidden field
			jQuery('input[type="hidden"][name="PreferenceRequest-FORMS"]').remove();
		}
	}

	
	//check for old and new method of disabling Demandbase logic
	function isDemandbaseOff(){
		if(DisableDB && DisableDB.toString().length>0) return true;
		else return false;
	}

    //handles country selection and rewriting of state/prov options depending on country chosen=
    function DetermineStateProvVis(evt){
        var curCountry=jQuery(getOne("country")).val();
		var oState=getOne('stateProv');
		var jState=null;
		var regInput=null;
		var tRegion="";
		var provs=null;
		var cMatch=false;
		var cPos=-1;
		if (!wasInitOptIn) InitOptIn(curCountry);
		
        if (oState!==null){
			jState=jQuery(oState);
			
			//determine if current country has a map
			//alert(provMap.length);
			for(var z=0;z<provMap.length;z++){
				if(provMap[z][0]==curCountry){
					cMatch=true;
					cPos=z;
					break;//exit for
				}
			}
			
			//hide/show and narrow down based on country
			if(cMatch){				
				jState.removeAttr("disabled");
				//jState.focus();

				jState.children("option").remove("*");
				provs=jState.children("option");

				//provMap = [['US',[['AK','Alaska'],[,]]]]
				jState.append("<option value=''>-- Please Select --</option>");
				for(var sp=0;sp<provMap[cPos][1].length;sp++){
					jState.append("<option value='"+provMap[cPos][1][sp][0]+"'>"+provMap[cPos][1][sp][1]+"</option>");
				}
				
				ShowRegForJQField(jState);
			}else{
				HideRegForField(oState);
				jState.attr("disabled","disabled");
			}
		}
		
		//show opt-in when CA,DE,ES,AU,NZ,GB and not already flagged explicitly subscribed
		if(PrefRequest){
		  if (!isExpSubscribed && (curCountry==="CA" || curCountry==="DE" || curCountry==="ES" || curCountry==="AU" || curCountry==="NZ" || curCountry==="GB")) jQuery(PrefRequest).show();
		  else if(curCountry!=="CA" && curCountry!=="DE" && curCountry!=="ES" && curCountry!=="AU" && curCountry!=="NZ" && curCountry!=="GB"){
			jQuery("#PreferenceRequest-FORMS").removeAttr("checked");
			jQuery(PrefRequest).hide();
		  }
		}
		
		//map country to region and save to hidden field
		regInput = getOne("Region");		
		if(regInput!==null){
			if(curCountry!==null && curCountry.length>0){
				for(var x=0; x<regionMap.length;x++){
					if(curCountry===regionMap[x][0]){
						if(regionMap[x][1]===0) tRegion='AMER';
						else if(regionMap[x][1]===1) tRegion='APAC';
						else if(regionMap[x][1]===2) tRegion='EUROPE';
						else if(regionMap[x][1]===3) tRegion='FGM';
						break;
					}
				}

				regInput.value=tRegion;
			}
			else regInput.value="";
		}
    }
	
	//delay ready call until jquery available
	function RunWhenReady(c){
		if(typeof jQuery === "undefined" && c<1000){setTimeout(function(){RunWhenReady(c+1)},100);}
		else if(typeof jQuery !== "undefined"){
			jQuery(document).ready(function(){			
				SetCampaignId();//set hidden values
				PrepHandlers1();
				jQuery('input[type=hidden]').closest('div.form-design-field').css("display", "none");//hide hidden field region gap
				
				//call extended version when cookie acceptance allows definition (defined in -prepop.js version)
				if(typeof RunWhenReady2 === 'function') RunWhenReady2();
			});
		}
	}
	
	//add jquery if not available, then Run custom scripts, wait up to 5 sec in WEM
	function INITIALIZE(cntr){		
		if(typeof jQuery === "undefined" && cntr<=5){		
			if(!ThirdPartyTracked() || cntr==5){
				var jq = document.createElement('script');
				jq.async = true;
				jq.src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';//http:
				var fs = document.getElementsByTagName('script')[0];
				fs.parentNode.insertBefore(jq,fs);
			}else{
				//likely in WEM and using their reference, wait a while before checking if needed
				setTimeout(function(){INITIALIZE(cntr+1)},1000);
			}
		}
			
		RunWhenReady(0);
	}
	
	//START initialization
	INITIALIZE(0);
