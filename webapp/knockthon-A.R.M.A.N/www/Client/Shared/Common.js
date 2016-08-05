CommonFunctions = {
    //common function for pagination
    paging: function ($rootScope, $scope, service, url, method, params, id) {
        $("#loading").show();
        service.GetListOfDataProjects(url, method, params)
        .then(
            function (response) {
                if (response.status == 200) {
                    var result = CommonFunctions.formatDataProjects($rootScope, response, id, params.page);
                    if (result.statuscode == 200) {
                        $scope.dataprojects = result.dataprojects;
                        $scope.LastDataProjectId = result.LastDataProjectId;
                        $scope.isShowFilters = result.isShowFilters;
                        $scope.oneAtTime = result.oneAtTime;
                        $scope.dataprojects.maxSize = $rootScope.DataProjectsPagingSize;
                        $scope.dataprojects.bigTotalItems = result.bigTotalItems;
                        $scope.dataprojects.bigCurrentPage = params.page;
                    }
                    else {
                        $scope.dataprojects = null;
                        $scope.isShowFilters = true;
                    }
                }
                else {
                    $scope.dataprojects = null;
                    $scope.isShowFilters = true;
                }
                $("#loading").hide();
            }
        )
    },

    //common function to get data projects listing
    getDataProjectsList:function(HomePageService, $scope, $rootScope, page,url,method){
        HomePageService.GetListOfDataProjects(url, method, { page: page })
        .then(
            function (response) {                
                if (response.status == 200) {                    
                    var result = CommonFunctions.formatDataProjects($rootScope, response, 4);
                    if (result.statuscode == 200) {
                        // angular.element("#filters").select2("val", "0");
                        $scope.dataprojects = result.dataprojects;
                        $scope.dataprojects[0].activeClass = "activebox";
                        $scope.currentdataproject = [$scope.dataprojects[0]];
                        $scope.audits = result.auditList;
                        debugger;
                        $scope.bigTotalItems = result.bigTotalItems;
                        $scope.showPagination = result.bigTotalItems > 10 ? true:false;
                        $scope.LastDataProjectId = result.LastDataProjectId;
                        $scope.isShowFilters = result.isShowFilters;
                        $scope.oneAtTime = result.oneAtTime;
                        $scope.dataprojects.maxSize = $rootScope.DataProjectsPagingSize;
                        $scope.dataprojects.bigTotalItems = result.bigTotalItems;
                        $scope.oneAtATime = true;
                        if(response.option != undefined && response.query != undefined){
                            angular.forEach($rootScope.globalSearchOptions, function (value, key) {
                                if(value.itemId.toString() == response.option){
                                    value.ticked = true;
                                }
                            });
                            switch(response.option){
                                case "1":
                                    $rootScope.placeholderText = "Enter Data-Project Id";
                                    //$rootScope.isShowTxtSearch = true;
                                    $rootScope.maxLength = 10;
                                    angular.element("#enter_search_text").val(response.query);
                                    angular.element("#enter_search_text").focus();
                                    break;
                                case "2":
                                    $rootScope.placeholderText = "Enter Title";
                                    //$rootScope.isShowTxtSearch = true;
                                    $rootScope.maxLength = 100;
                                    angular.element("#enter_search_text").val(response.query);
                                    angular.element("#enter_search_text").focus();
                                    break;
                                case "3":                    
                                    $rootScope.placeholderText = "Enter Version Id";
                                    //$rootScope.isShowTxtSearch = true;
                                    $rootScope.maxLength = 10;
                                    angular.element("#enter_search_text").val(response.query);
                                    angular.element("#enter_search_text").focus();
                                    break;
                                case "4":
                                    $rootScope.isShowUserddn = true;
                                    angular.forEach($rootScope.globalUsers, function (value, key) {
                                        if(value.userid.toString() == response.query){
                                            value.ticked = true;
                                        }
                                    });
                                    break;
                                case "5":
                                    $rootScope.isShowStatusddn = true;
                                    angular.forEach($rootScope.globalStatusList, function (status, key) {
                                        if(response.query.indexOf(status.itemId.toString()) >= 0){
                                            status.ticked = true;
                                        }
                                    });
                                    break;
                                case "6":
                                    $rootScope.isShowDpTypeddn = true;
                                    angular.forEach($rootScope.dptypeOptions, function (dptype, key) {
                                        debugger;
                                        if(dptype.value.toString() == response.query){
                                            dptype.ticked = true;
                                        }
                                    });
                                    break;
                            }                            
                        }
                    }
                    else {
                        $scope.dataprojects = null;
                        $scope.isShowFilters = true;
                    }
                }
                else {
                    $scope.dataprojects = null;
                    $scope.isShowFilters = true;
                }
                $("#loading").hide();
            }
        )
    },

    //common function to get users list who can perform actions
    getActionUsers:function(HomePageService,$rootScope,userrole){
        HomePageService.GetUsers(userrole, null)
        .then(
            function (response) {
                if (response.status == 200) {
                    var userdata = JSON.parse(response.data);
                    var userResult = CommonFunctions.userRoles(userdata.result);
                    $rootScope.actionUsers = userResult;
                }
                else {
                    $rootScope.actionUsers = [
                    { Name: "Loading...", Role: "" }
                    ]
                }
                $("#loading").hide();
            }
        )
    },

    //common function for formating dataprojects
    formatDataProjects: function ($rootScope, jsonresult, id) {
        var resultList = {};

        var dataprojectsobject = JSON.parse(jsonresult.data);
        var audits = JSON.parse(jsonresult.audit);
        var lastdataprojectobject = JSON.parse(jsonresult.lastDataProject);
        if (dataprojectsobject.statuscode == 200) {
            var dataprojects = CommonFunctions.showButtons(dataprojectsobject.result, lastdataprojectobject.result, $rootScope.CurrentUser, id, $rootScope);
            if (dataprojects != null) {
                dataprojects.LastDataProjectId = dataprojects.LastDataProjectId;
                var isShowFilters = true;
                var searchedResultData = CommonFunctions.getData($rootScope);
                if (searchedResultData != undefined && searchedResultData[0].optionSelectedForSearch != undefined && searchedResultData[1].query != undefined) {
                    isShowFilters = searchedResultData[0].optionSelectedForSearch == "2" || searchedResultData[0].optionSelectedForSearch == "4" || searchedResultData[0].optionSelectedForSearch == "6" ? true : false;
                }
                dataprojects[0].isFirstItem = true;
                dataprojects[0].isFirstOpen = true;
                dataprojects.isShowPaging = dataprojectsobject.totalresults > 5 ? true : false;
                var auditTrail =CommonFunctions.audits(audits.result,$rootScope);
                resultList = {
                    dataprojects: dataprojects,
                    isShowFilters: isShowFilters,
                    auditList: auditTrail,
                    oneAtTime: true,
                    bigTotalItems: dataprojectsobject.totalresults,
                    statuscode: 200
                };
            }
        }
        else {
            resultList = { dataprojects: null, statuscode: 400 };
        }
        return resultList;
    },

    //common function for audit trail
    audits:function(audits,$rootScope){
        //show audit trail
        var countOfDataProjectsInOpenState = $.grep(audits, function (e) {
            return e.status == "1";
        }).length;
        var index1 = 0;
        angular.forEach(audits, function (item, index) {
            var userName = (item.assignby.toLowerCase() != item.assignto.toLowerCase()) ? item.assignto : "self";
            if (item.attachedfile != null && item.attachedfile.length > 0) {
                var tempArray = [];
                tempArray.push(item);
                var modifiedDataProjectWithFiles = CommonFunctions.files($rootScope, tempArray);
                if (modifiedDataProjectWithFiles.length <= 0) {
                    return false;
                }
                if (audits[0].status > 6) {
                    angular.forEach(item.Files, function (file, index) {
                        file.isShowFtpSpan = file.name.includes(".zip") ? true : false;                    
                    })                
                }
                item = modifiedDataProjectWithFiles[0];
            }

            switch (item.status) {
                case 1:
                    if (countOfDataProjectsInOpenState > 1) {
                        item.iTagClass = "update-ic";
                        countOfDataProjectsInOpenState--;
                    }
                    else {
                        item.iTagClass = "add-ic";
                    }
                    item.Action = {
                        ShowClassOnStatus: 'open',
                        className: "label-success",
                        username: userName,
                        status: 'Open'
                    };
                    break;
                case 4:
                    if (item.status == audits[(index + 1)].status) {
                        item.iTagClass = "update-ic";
                    }
                    else {
                        item.iTagClass = "rejected-ic";
                    }
                    item.Action = {
                        ShowClassOnStatus: 'rejected',
                        className: "label-warning",
                        username: userName,
                        status: 'Rejected'
                    };
                    break;
                case 2:

                    item.iTagClass = "qa-ready-ic";
                    // var isDownloadPlusAvailable = (dataproject != null && dataproject.downloadplusstatus != null);
                    // if (index1 == 0 && isDownloadPlusAvailable == true && (dataproject.downloadplusstatus[0].completed > 0 || dataproject.downloadplusstatus[0].pending > 0 || dataproject.downloadplusstatus[0].inprogress > 0)) {
                    //     item.DownloadPlus = dataproject.downloadplusstatus;
                    //     item.DownloadPlus.Details = {
                    //         description: 'Go to Download+ Page',
                    //         actionUrl: '#/dataproject/downloadplus/' + dataproject.dataprojectid + ''
                    //     }
                    //     index1++;
                    // }
                    // else {
                    //     index1++;
                    // }
                    item.Action = {
                        ShowClassOnStatus: 'qaready',
                        className: "label-success",
                        username: userName,
                        status: 'QA-Ready'
                    };
                    break;
                case 3:
                    item.iTagClass = "accepted-ic";
                    item.Action = {
                        ShowClassOnStatus: 'signedoff',
                        className: "label-success",
                        username: userName,
                        status: 'Signed-Off'
                    };
                    break;
                case 5:
                    item.iTagClass = "discarded-ic";
                    item.Action = {
                        ShowClassOnStatus: 'discarded',
                        className: "label-danger",
                        username: userName,
                        status: 'Discarded'
                    };
                    break;
                case 6:
                    item.iTagClass = "publish-ic";
                    item.Action = {
                        ShowClassOnStatus: 'published',
                        className: "label-success",
                        username: userName,
                        status: 'Published'
                    };
                    break;
                case 8:
                    item.iTagClass = "rollback-ic";
                    item.Action = {
                        ShowClassOnStatus: 'rolledback',
                        className: "label-success",
                        username: userName,
                        status: 'RolledBack'
                    };
                    break;
                case 11:
                    item.iTagClass = "rollbackinpending-ic";
                    item.Action = {
                        ShowClassOnStatus: 'rollbackinpending',
                        className: "label-info",
                        username: userName,
                        status: 'RollbackInPending'
                    };
                    break;
                case 10:
                    item.iTagClass = "publishinpending-ic";
                    item.Action = {
                        ShowClassOnStatus: 'rolledback',
                        className: "label-info",
                        username: userName,
                        status: 'PublishInPending'
                    };
                    break;
                case 9:
                    item.iTagClass = "rollbackinpro-ic";
                    item.Action = {
                        ShowClassOnStatus: 'rollbackinprogress',
                        className: "label-info",
                        username: userName,
                        status: 'RollbackInProgress'
                    };
                    break;
                case 7:
                    item.iTagClass = "publishinpro-ic";
                    item.Action = {
                        ShowClassOnStatus: 'rolledback',
                        className: "label-info",
                        username: userName,
                        status: 'PublishInProgress'
                    };
                    break;
                case 12:
                    item.iTagClass = "uploadinprogress-ic";
                    item.Action = {
                        ShowClassOnStatus: 'uploadinprogress',
                        className: "label-info",
                        username: userName,
                        status: 'UploadInProgress'
                    };
                    break;
                case 13:
                    item.iTagClass = "uploaded-ic";
                    item.Action = {
                        ShowClassOnStatus: 'uploaded',
                        className: "label-success",
                        username: userName,
                        status: 'Uploaded'
                    };
                    break;
            }
        });
        return audits;
    },
    //common function for filters of dataprojects present
    filter: function ($scope, $rootScope, service, url, method, params, id) {
        $("#loading").show();
        service.GetListOfDataProjects(url, method, params)
        .then(
            function (response) {
                if (response.status == 200) {
                    var result = CommonFunctions.formatDataProjects($rootScope, response, id);

                    if (result.statuscode == 200) {
                        $scope.dataprojects = result.dataprojects;
                        $scope.LastDataProjectId = result.LastDataProjectId;
                        $scope.isShowFilters = result.isShowFilters;
                        $scope.oneAtTime = result.oneAtTime;
                        $scope.dataprojects.maxSize = $rootScope.DataProjectsPagingSize;
                        $scope.dataprojects.bigTotalItems = result.bigTotalItems;
                    }
                    else {
                        $scope.dataprojects = [];
                        $scope.isShowFilters = true;
                    }
                }
                else {
                    $scope.dataprojects = [];
                    $scope.isShowFilters = true;
                }
                $("#loading").hide();
            }
        )
    },

    //common function for deciding which buttons to show for dataproject with current status
    showButtons: function (dataProjects, lastDataProject, CurrentUser, tabId, $rootScope) {
        var buttonArray = [];
        var count = 0;
        var modifiedDataProjectsWithFiles = CommonFunctions.files($rootScope, dataProjects);
        angular.forEach(modifiedDataProjectsWithFiles, function (dataproject, index) {
            var isDownloadPlusReportsAvailable = dataproject.downloadplusstatus[0].completed == 0 && dataproject.downloadplusstatus[0].pending == 0 && dataproject.downloadplusstatus[0].inprogress == 0 ? false : true;
            dataproject.isDownloadPlusReportsAvailable = isDownloadPlusReportsAvailable;
            dataproject.panelClass = dataproject.dataprojecttype.toLowerCase() == "casadocs" ? "casadoc-head" : dataproject.dataprojecttype.toLowerCase() == "newrow" ? "newrow-head" : "";
            var isShowDownloadPlusLink = false;
            if (index == 0) {
                dataproject.expandClass = "Expanded";
            }

            if (isDownloadPlusReportsAvailable == true && dataproject.attachedfile != undefined && dataproject.attachedfile.includes(".csv")) {
                dataproject.isShowDownloadPlusLink = true;
            }
            else if (isDownloadPlusReportsAvailable == true) {
                dataproject.isShowDownloadPlusLink = true;
            }
            dataproject.ShowMessage = false;

            dataproject.downloadplusstatus.completed = dataproject.downloadplusstatus[0].completed;
            dataproject.downloadplusstatus.inprogress = dataproject.downloadplusstatus[0].inprogress;
            dataproject.downloadplusstatus.pending = dataproject.downloadplusstatus[0].pending;            
            buttonArray = [];

            switch (dataproject.status) {
                case "1":
                case "4":
                    dataproject.ShowClassOnStatus = dataproject.status == "1"?"open":"rejected";
                    dataproject.isShowEditButton = (dataproject.createdby.toLowerCase() == CurrentUser.name.toLowerCase() || CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("2") >= 0) ? true : false;
                    if (CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("2") >= 0) {
                        buttonArray.push({ isShowBtn: false, action: "Upload Change File", PopoverContent: "Click on this button to mark this data project as QA-Ready and send the work done to reviewer for review purpose.", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=1" });
                    }
                    /*if case changed as sourcer cannot discard dataproject in open/rejected state*/

                    //if (CurrentUser.name.toLowerCase() == dataproject.createdby.toLowerCase() || CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("2") >= 0) {
                    if (CurrentUser.name.toLowerCase() == dataproject.createdby.toLowerCase() || CurrentUser.role.indexOf("1") >= 0) {
                        buttonArray.push({ isShowBtn: false, action: "Discard", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=4", glyphiconClass: "glyphicon-ban-circle" });
                    }
                    dataproject.status = dataproject.status == "1" ? "Open" : "Rejected";
                    dataproject.Buttons = {
                        description: 'open/rejected',
                        //options: CommonFunctions.addButtons(buttonArray) 
                        options: CommonFunctions.addButtons(buttonArray)
                    };
                    buttonArray = [];
                    dataproject.ShowMessage = false;
                    dataproject.PopoverContent = "The files appearing under attachment are to support data mining process. These files will no longer be available under this section after the data project has been marked as QA-Ready.";
                    break;
                case "2":
                    dataproject.ShowClassOnStatus = "qaready";
                    dataproject.isShowEditButton = (dataproject.createdby.toLowerCase() == CurrentUser.name.toLowerCase() || CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("3") >= 0) ? true : false;
                    if (CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("3") >= 0) {
                        if (dataproject.attachedfile.includes(".csv") && !dataproject.dataprojecttype.includes("newrow")) {
                            buttonArray.push({ isShowBtn: false, action: "Download", actionUrl: "" + $rootScope.DownloadPlusUrl + "" + dataproject.dataprojectid + "", glyphiconClass: "glyphicon-plus" });
                        }
                        buttonArray.push({ isShowBtn: false, action: "Sign-Off", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=2", glyphiconClass: "glyphicon-ok" });
                        buttonArray.push({ isShowBtn: false, action: "Reject", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=3", glyphiconClass: "glyphicon-remove" });
                    }

                    if (CurrentUser.name.toLowerCase() == dataproject.createdby.toLowerCase() || CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("3") >= 0) {
                        buttonArray.push({ isShowBtn: false, action: "Discard", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=4", glyphiconClass: "glyphicon-ban-circle" });
                    }
                    dataproject.status = "QA-Ready";
                    dataproject.Buttons = {
                        description: 'QA-Ready',
                        options: CommonFunctions.addButtons(buttonArray)
                    };
                    buttonArray = [];
                    dataproject.ShowMessage = false;
                    dataproject.PopoverContent = "The file appearing under attachment is the file delivered by sourcer for review purpose.";
                    break;
                case "3":
                    dataproject.ShowClassOnStatus = "signedoff";
                    dataproject.isShowEditButton = (dataproject.createdby.toLowerCase() == CurrentUser.name.toLowerCase() || CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("4") >= 0) ? true : false;
                    if (CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("4") >= 0) {
                        buttonArray.push({ isShowBtn: true, action: "Publish", actionUrl: "javascript:void(0)" });
                    }
                    if (CurrentUser.name.toLowerCase() == dataproject.assignedto.toLowerCase() || CurrentUser.role.indexOf("1") >= 0) {
                        buttonArray.push({ isShowBtn: false, action: "Discard", actionUrl: "" + $rootScope.ActionUrl + "" + dataproject.dataprojectid + "?mode=4", glyphiconClass: "glyphicon-ban-circle" });
                    }
                    dataproject.status = "Signed-Off";
                    dataproject.Buttons = {
                        description: 'signedoff',
                        options: CommonFunctions.addButtons(buttonArray)
                    };
                    buttonArray = [];
                    dataproject.ShowMessage = false;
                    dataproject.PopoverContent = "The file appearing under attachment is the file delivered by sourcer for review purpose.";
                    break;
                case "5":
                    dataproject.ShowClassOnStatus = "discarded";
                    dataproject.status = "Discarded";
                    break;
                case "6":
                    dataproject.ShowClassOnStatus = "published";
                    if (lastDataProject != null && count == 0 && lastDataProject[0].dataprojectid != null && lastDataProject[0].dataprojectid.toString().length > 0 && (lastDataProject[0].publishinqueue == undefined || lastDataProject[0].publishinqueue.length == 0) && (lastDataProject[0].dataprojectid.toString() == dataproject.dataprojectid.toString()) && (CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("4") >= 0)) {
                        buttonArray.push({ action: "Rollback", actionUrl: "javascript:void(0)" });
                        dataproject.Buttons = {
                            description: 'published',
                            options: [({ action: "Rollback", actionUrl: "javascript:void(0)", className: 'btn btn-primary' })],
                        };
                        count++;
                        dataproject.ShowMessage = false;
                    }
                    else {
                        if (dataproject.dataprojecttype == "cvc" || dataproject.dataprojecttype == "newrow") {
                            dataproject.ShowMessage = true;
                        }
                        else
                            dataproject.ShowMessage = false;
                    }
                    dataproject.status = "Published";
                    dataproject.PopoverContent = "The file(s) appearing under attachment have batch and error data (if available).";
                    break;
                case "7":
                case "8":
                case "10":
                    dataproject.ShowClassOnStatus = dataproject.status == "7" ? "publishinprogress" : dataproject.status == "8" ? "rolledback" : "publishinpending";
                    dataproject.ShowMessage = false;
                    dataproject.status = dataproject.status == "7" ? "PublishInProgress" : dataproject.status == "8" ? "Rolledback" : "PublishInPending";
                    break;
                case "9":
                case "11":
                    dataproject.Buttons = {
                        description: 'temp',
                    };
                    dataproject.ShowClassOnStatus = dataproject.status == "9" ? "rollbackinprogress" : "rollbackinpending";
                    dataproject.ShowMessage = false;
                    dataproject.status = dataproject.status == "9" ? "RollbackInProgress" : "RollbackInPending";
                    //dataproject.ShowMessage = true;
                    break;
                case "12":
                
                    dataproject.ShowClassOnStatus = "uploadinprogress";
                    dataproject.ShowMessage = false;
                    dataproject.status = "UploadInProgress";
                    break;
                case "13":
                    dataproject.ShowClassOnStatus = "uploaded";
                    if (lastDataProject != null && count == 0 && lastDataProject[0].dataprojectid != null && lastDataProject[0].dataprojectid.toString().length > 0 && (lastDataProject[0].publishinqueue == undefined || lastDataProject[0].publishinqueue.length == 0) && (lastDataProject[0].dataprojectid.toString() == dataproject.dataprojectid.toString()) && (dataproject.attachedfile != undefined && dataproject.attachedfile.length > 0 && dataproject.attachedfile.includes(".csv")) && (CurrentUser.role.indexOf("1") >= 0 || CurrentUser.role.indexOf("4") >= 0)) {
                        buttonArray.push({ action: "Rollback", actionUrl: "javascript:void(0)" });
                        dataproject.Buttons = {
                            description: 'published',
                            options: [({ action: "Rollback", actionUrl: "javascript:void(0)", className: 'btn btn-primary' })],
                        };
                        count++;
                        dataproject.ShowMessage = false;
                    }
                    else {
                        if (dataproject.dataprojecttype == "casadocs" && dataproject.attachedfile != undefined && dataproject.attachedfile.includes(".csv")) {
                            dataproject.ShowMessage = true;
                        }
                        else
                            dataproject.ShowMessage = false;
                    }
                    dataproject.PopoverContent = "The file(s) appearing under attachment have batch and error data (if available).";
                    dataproject.status = "Uploaded";
                    break;
                default:
                    break;
            }
        });
        return dataProjects;
        //var listOfDataProjectsWithCurrentRole = "";
        //switch (tabId) {
        //    case "1":
        //    case "2":
        //        listOfDataProjectsWithCurrentRole = dataProjects;
        //        break;
        //    case "3":
        //    case "4":
        //        listOfDataProjectsWithCurrentRole = $.grep(dataProjects, function (dataProject) {
        //            return dataProject.status.toLowerCase() !== "open" && dataProject.status.toLowerCase() !== "discarded";
        //        });
        //        break;
        //}
        //return listOfDataProjectsWithCurrentRole;
    },

    //common function for displaying files
    files: function ($rootScope, dataprojects) {        
        angular.forEach(dataprojects, function (dataproject, index) {
            var fileArray = [];
            if (dataproject.attachedfile != null && dataproject.attachedfile.length > 0) {
                var temp = CommonFunctions.getFilNamesWithExt($rootScope.allowedExtensionsForCreatingDataProject, dataproject.attachedfile).join("");
                //var tempFileArray = dataproject.attachedfile.split(/(.*?.[A-Za-z]{3,5}\,)/gi).filter(function (e) { return e });  //regex for keeping delimiter with string splitted and filter is used to remove element of array if length is 0.
                var tempFileArray = temp.split(",extractfromhere;").filter(function (v) { return v !== '' });
                //for action pages
                var csize = "";
                if (dataproject.mode != undefined) {
                    angular.forEach(tempFileArray, function (file, index) {
                        file = file.replace(/\,$/, '');
                        var fileSize = "";
                        var fileUnit = "";
                        var fileName = "";
                        var filePath = "";
                        var fs = parseInt(file.substring(2, file.indexOf('_')));
                        switch (true) {
                            case (fs < 1024):
                                csize = fs + " bytes";
                                break;
                            case (fs >= 1024 && fs < 1048576):
                                csize = Math.round(fs / 1024) + " KB";
                                break;
                            case (fs >= 1048576 && fs < 1073741824):
                                csize = Math.round(fs / 1048576) + " MB";
                                break;
                            case (fs >= 1073741824):
                                csize = Math.round(fs / 1073741824) + " GB";
                                break;
                        }

                        fileName = file.substring(file.indexOf("_", file.indexOf("_") + 1) + 1);
                        if (file.substring(file.lastIndexOf(".") + 1).toLowerCase() == "zip") {
                            fileArray.push({ "name": fileName, "size": fileSize, "unit": fileUnit, "csize": csize });
                        }
                        else if (file.substring(file.lastIndexOf(".") + 1).toLowerCase() == "csv") {
                            switch (dataproject.mode) {
                                case "1":
                                    break;
                                case "2":
                                    fileArray.push({ "name": fileName, "size": fileSize, "unit": fileUnit, "csize": csize });
                                    break;
                                case "3":
                                    fileArray.push({ "name": fileName, "size": fileSize, "unit": fileUnit, "csize": csize });
                                    break;
                                case "4":
                                    fileArray.push({ "name": fileName, "size": fileSize, "unit": fileUnit, "csize": csize });
                                    break;
                            }
                        }
                    })
                }

                else {
                    angular.forEach(tempFileArray, function (file, index) {
                        file = file.replace(/\,$/, '');
                        var fileSize = "";
                        var fileUnit = "";
                        var fileName = "";
                        var filePath = "";
                        var isShowFtpSpan = (file.includes(".zip") && dataproject.isfilefromftp) ? true : false;
                        file = file.startsWith(",") ? file.substring(1) : file;
                        var fs = parseInt(file.substring(2, file.indexOf('_')));
                        switch (true) {
                            case (fs < 1024):
                                csize = fs + " bytes";
                                break;
                            case (fs >= 1024 && fs < 1048576):
                                csize = Math.round(fs / 1024) + " KB";
                                break;
                            case (fs >= 1048576 && fs < 1073741824):
                                csize = Math.round(fs / 1048576) + " MB";
                                break;
                            case (fs >= 1073741824):
                                csize = Math.round(fs / 1073741824) + " GB";
                                break;
                        }
                        fileSize = file.substring(2, file.indexOf('_')) / 1024 > 1 ? file.substring(2, file.indexOf('_')) / 1024 : file.substring(2, file.indexOf('_'));
                        fileUnit = file.substring(2, file.indexOf('_')) / 1024 > 1 ? "Kb" : "bytes";

                        switch (dataproject.status.toString()) {
                            case "1":
                            case "4":
                                fileName = file.substring(file.indexOf("_", file.indexOf("_") + 1) + 1);
                                filePath = "" + $rootScope.AttachedFileUrl + "" + file + "";
                                break;
                            case "2":
                            case "3":
                                fileName = file.substring(file.indexOf("_", file.indexOf("_") + 1) + 1);
                                filePath = "" + $rootScope.AttachedFileUrl + "" + file + "";
                                break;
                            case "6":
                                fileName = file.substring(file.indexOf("_") + 1);
                                if (file.includes("batch.csv")) {

                                    filePath = "" + $rootScope.BatchFileUrl + "" + file.substring(file.indexOf("_") + 1) + "";
                                }
                                else {

                                    filePath = "" + $rootScope.ErrorFileUrl + "" + file.substring(file.indexOf("_") + 1) + "";
                                }
                                break;
                            case "5":
                            case "7":
                            case "8":
                            case "9":
                            case "10":
                            case "11":
                            case "12":
                            case "13":
                                fileName = file.substring(file.indexOf("_") + 1);
                                if (file.includes("batch.csv")) {

                                    filePath = "" + $rootScope.BatchFileUrl + "" + file.substring(file.indexOf("_") + 1) + "";
                                }
                                else {

                                    filePath = "" + $rootScope.ErrorFileUrl + "" + file.substring(file.indexOf("_") + 1) + "";
                                }
                                break;
                        }

                        fileArray.push({ "name": fileName, "size": fileSize, "unit": fileUnit, "csize": csize, "path": filePath, "isShowFtpSpan": isShowFtpSpan });
                    });
                }
                dataproject.Files = fileArray;
            }
        })
        return dataprojects;
    },

    //common function for displaying cutomised user roles
    userRoles: function (users, tickUserId) {
        if (users != undefined) {
            angular.forEach(users, function (user, index) {
                var roles = user.role.split(',');
                if (roles != null) {
                    var rls = [];
                    angular.forEach(roles, function (role, i) {
                        switch (role) {
                            case "0":
                                rls.push("SA");
                                break;
                            case "1":
                                rls.push("A");
                                break;
                            case "2":
                                rls.push("S");
                                break;
                            case "3":
                                rls.push("R");
                                break;
                            case "4":
                                rls.push("P");
                                break;
                            case "5":
                                rls.push("C");
                                break;
                        }
                    });
                    user.role = rls.indexOf("A") >= 0 ? "A" : rls.join(",");
                    if (tickUserId != undefined && index == tickUserId) {
                        user.ticked = true;
                    }
                    else
                        user.ticked = false;
                }
            })
            //users.unshift({ ticked: false, uid: 0, userid: "", name: "Select user" });            
            return users;
        }
    },

    //common function for adding buttons which is used internally as of now in showButtons
    addButtons: function (buttonArray) {

        var options = [];
        angular.forEach(buttonArray, function (button, index) {
            options.push({ isShowBtn: button.isShowBtn, action: button.action, actionUrl: button.actionUrl, className: 'btn btn-primary', glyphiconClass: button.glyphiconClass, PopoverContent: button.PopoverContent })
        })
        return options;
    },

    //common function for uploading one file at a time
    uploadFile: function (model, $scope, $compile, Upload, service) {
        switch (model.isFtpFile) {
            case true:

                var file = JSON.parse(model.file);
                //var fSize = ((parseInt(file.size)) / (1024 * 1024)) > 1024 ? file.size + " GB" : file.size + " MB";
                var prg = '<div class="progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%"><span class="sr-only">100% Complete (success)</span></div></div>';
                var template = "<div id=" + (model.elementId) + " class='upload-file " + $scope.uploadFileInfo.appendFileToDiv + "'><span class='uploadfile-name' title='" + file.name + "'>" + file.name + "</span><span class='txtsm pull-left'>- " + file.csize + "</span><a class='glyphicon glyphicon-trash del-file' ng-click='deleteZipFile(" + model.elementId + ")'></a>" + prg + "</div>";
                var linkFn = $compile(template);
                var content = linkFn($scope);
                $scope.elementId = model.elementId;
                model.numberOfFileUploaded = model.numberOfFileUploaded + 1;
                $scope.numberOfFilesUploaded = model.numberOfFileUploaded;
                model.fileArray.push(file.name);
                model.extensionsArray.push(model.uploadedFileExtension);
                angular.element("#" + $scope.uploadFileInfo.appendFileToDiv + "").append(content);
                break;
            case false:

                var filesize = model.file.size / 1024 > 1 ? parseInt(model.file.size / 1024) + 'Kb' : model.file.size + 'bytes';
                $scope.progress = 0;
                if ($.inArray(model.uploadedFileExtension, $scope.allowedExtensions) != -1) {
                    if (model.file.size > ($scope.maxFileSize)) {
                        switch (model.filetype) {
                            case "supporting":
                                $scope.fileuploadederror = true;
                                break;
                            case "casadocs_supporting":

                                $scope.fileuploadederrorinzip = true;
                                $scope.IsDisableZipFileUploadBtn = false;
                                break;
                            case "casadocs_qaready":

                                $scope.fileuploadederrorinzip = true;
                                $scope.IsDisableFileUploadBtn = false;
                                break;
                        }
                        $scope.elementId = $scope.elementId - 1;
                        $scope.error = "Please upload a smaller file, max allowed size is " + $scope.maxFileSize / (1024 * 1024) + " MB";
                        return false;
                    }
                    if (model.file.size <= 0) {
                        $scope.elementId = $scope.elementId - 1;
                        $scope.fileuploadederror = true;
                        $scope.error = "Please upload a larger file, min allowed size is " + $scope.minFileSize + " bytes";
                        return false;
                    }


                    switch (model.filetype) {
                        case "supporting":
                            if ($scope.numberOfSupportingFilesUploaded < 10) {
                                var prg = '<div class="progress-striped active progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + $scope.progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + $scope.progress + '%"><span class="sr-only">' + $scope.progress + '% Complete (success)</span></div></div>';
                                var template = "<div id=" + (model.elementId) + " class='upload-file'><span class='uploadfile-name' title='" + model.file.name + "'>" + model.file.name + "</span><span class='txtsm pull-left'>- " + filesize + "</span><span class='glyphicon glyphicon-trash ng-scope disable-file'></span><a class='glyphicon glyphicon-trash del-file' ng-hide='true' ng-click='delete(" + model.elementId + ")'></a>" + prg + "</div>";
                                var linkFn = $compile(template);
                                var content = linkFn($scope);
                                angular.element("#" + $scope.uploadFileInfo.appendFileToDiv + "").append(content);
                                service.uploadFile(model.file, Upload, $scope.uploadFileInfo.url).then(
                                // file is uploaded successfully
                                function (response) {
                                    if (response.status == 200) {
                                        $scope.elementId = model.elementId;
                                        $scope.progress = 100;
                                        model.numberOfSupportingFilesUploaded = model.numberOfSupportingFilesUploaded + 1;
                                        $scope.numberOfSupportingFilesUploaded = model.numberOfSupportingFilesUploaded;
                                        model.fileArray.push(response.filename);
                                        model.extensionsArray.push(model.uploadedFileExtension);
                                        angular.element("span.disable-file").hide();
                                        angular.element("div.progress>").css("width", "" + $scope.progress + "%");
                                        angular.element("div.progress").eq(model.fileArray.length - 1).removeClass("progress-striped active");
                                        angular.element("a.del-file").removeClass("ng-hide");
                                        $scope.uploadFileInfo.numberOfSupportingFilesAllowed = $scope.uploadFileInfo.numberOfSupportingFilesAllowed != undefined ? $scope.uploadFileInfo.numberOfSupportingFilesAllowed : $scope.numberOfSupportingFilesUploaded;

                                        switch ($scope.uploadFileInfo.type) {
                                            case "create":
                                            case "update":
                                                if ($scope.numberOfSupportingFilesUploaded >= $scope.uploadFileInfo.numberOfSupportingFilesAllowed)
                                                    $scope.IsDisableFileUploadBtn = true;
                                                else
                                                    $scope.IsDisableFileUploadBtn = false;
                                                break;
                                            case "action":
                                                switch (model.form.type) {
                                                    case "cvc":
                                                    case "newrow":
                                                        if ($scope.numberOfSupportingFilesUploaded >= $scope.uploadFileInfo.numberOfSupportingFilesAllowed) {
                                                            $scope.IsDisableFileUploadBtn = true;
                                                            $scope.isDisableButton = false;
                                                        }
                                                        else {
                                                            $scope.isDisableButton = false;
                                                            $scope.IsDisableFileUploadBtn = false;
                                                        }
                                                        break;
                                                    case "casadocs":

                                                        switch ($scope.isPreviouslyFileUploaded) {
                                                            case true:
                                                                $scope.isDisableButton = false;
                                                                break;
                                                            case false:
                                                                $scope.isDisableButton = (model.extensionsArray.indexOf("zip") >= 0 && $scope.uploadFileInfo.assignto.length > 0) ? false : true;
                                                                if ($scope.numberOfFilesUploaded >= $scope.uploadFileInfo.numberOfFilesAllowedToUpload)
                                                                    $scope.IsDisableFileUploadBtn = true;
                                                                else
                                                                    $scope.IsDisableFileUploadBtn = false;
                                                                break;
                                                        }
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    else {
                                        angular.element("div.upload-file").eq(model.fileArray.length).remove();
                                        sweetAlert({
                                            title: "Error!",
                                            text: "Please upload correct file.",
                                            type: "error"
                                        });
                                        return false;
                                    }
                                },
                             function (resp) {
                                 // handle error
                             }, function (evt) {
                                 // progress notify                 
                                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                 if (progressPercentage == 100)
                                     $scope.progress = 90;
                                 else
                                     $scope.progress = progressPercentage;
                                 angular.element("." + $scope.uploadFileInfo.nameOfClass + "").children("div.progress").eq(model.extensionsArray.length).children().css("width", "" + $scope.progress + "%");
                             });
                            }
                            else
                                return false;
                            break;
                        case "casadocs_supporting":

                            if ($scope.numberOfChangeFileUploaded < 1) {
                                angular.element("#fromFTP").addClass("disable-filter");
                                angular.element("#fromLocalDisk").addClass("disable-filter");
                                var prg = '<div class="progress-striped active progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + $scope.progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + $scope.progress + '%"><span class="sr-only">' + $scope.progress + '% Complete (success)</span></div></div>';
                                var template = "<div id=" + (model.elementId) + " class='upload-file'><span class='uploadfile-name' title='" + model.file.name + "'>" + model.file.name + "</span><span class='txtsm pull-left'>- " + filesize + "</span><span class='glyphicon glyphicon-trash ng-scope disable-file'></span><a class='glyphicon glyphicon-trash del-file' ng-hide='true' ng-click='deleteZipFile(" + model.elementId + ")'></a>" + prg + "</div>";
                                var linkFn = $compile(template);
                                var content = linkFn($scope);
                                angular.element("#" + $scope.uploadFileInfo.appendFileToDiv + "").append(content);
                                service.uploadFile(model.file, Upload, $scope.uploadFileInfo.url).then(
                                // file is uploaded successfully
                                function (response) {
                                    if (response.status == 200) {
                                        $scope.elementId = model.elementId;
                                        $scope.progress = 100;
                                        model.numberOfZipFilesUploaded = model.numberOfZipFilesUploaded + 1;
                                        $scope.numberOfZipFilesUploaded = model.numberOfZipFilesUploaded;
                                        model.fileArray.push(response.filename);
                                        model.extensionsArray.push(model.uploadedFileExtension);
                                        angular.element("span.disable-file").hide();
                                        angular.element("div.progress>").css("width", "" + $scope.progress + "%");
                                        angular.element("div.progress").eq(model.fileArray.length - 1).removeClass("progress-striped active");
                                        angular.element("a.del-file").removeClass("ng-hide");
                                        $scope.uploadFileInfo.numberOfZipFilesAllowed = $scope.uploadFileInfo.numberOfZipFilesAllowed != undefined ? $scope.uploadFileInfo.numberOfZipFilesAllowed : $scope.numberOfZipFilesUploaded;

                                        switch ($scope.isPreviouslyFileUploaded) {
                                            case true:
                                                $scope.isDisableButton = false;
                                                break;
                                            case false:
                                                $scope.isDisableButton = (model.extensionsArray.indexOf("zip") >= 0 && $scope.uploadFileInfo.assignto.length > 0) ? false : true;
                                                if ($scope.numberOfFilesUploaded >= $scope.uploadFileInfo.numberOfFilesAllowedToUpload)
                                                    $scope.IsDisableFileUploadBtn = true;
                                                else
                                                    $scope.IsDisableFileUploadBtn = false;
                                                break;
                                        }
                                    }
                                    else {
                                        angular.element("div.upload-file").eq(model.fileArray.length).remove();
                                        sweetAlert({
                                            title: "Error!",
                                            text: "Please upload correct file.",
                                            type: "error"
                                        });
                                        return false;
                                    }
                                },
                             function (resp) {
                                 // handle error
                             }, function (evt) {
                                 // progress notify                 
                                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                 if (progressPercentage == 100)
                                     $scope.progress = 90;
                                 else
                                     $scope.progress = progressPercentage;
                                 angular.element("." + $scope.uploadFileInfo.nameOfClass + "").children("div.progress").eq(model.extensionsArray.length).children().css("width", "" + $scope.progress + "%");
                             });
                                break;

                            }
                            else
                                return false;
                        case "casadocs_qaready":

                            if ($scope.numberOfChangeFileUploaded < 2) {
                                var prg = '<div class="progress-striped active progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + $scope.progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + $scope.progress + '%"><span class="sr-only">' + $scope.progress + '% Complete (success)</span></div></div>';
                                var template = "<div id=" + (model.elementId) + " class='upload-file'><span class='uploadfile-name' title='" + model.file.name + "'>" + model.file.name + "</span><span class='txtsm pull-left'>- " + filesize + "</span><span class='glyphicon glyphicon-trash ng-scope disable-file'></span><a class='glyphicon glyphicon-trash del-file' ng-hide='true' ng-click='deleteZipFile(" + model.elementId + ")'></a>" + prg + "</div>";
                                var linkFn = $compile(template);
                                var content = linkFn($scope);
                                angular.element("#" + $scope.uploadFileInfo.appendFileToDiv + "").append(content);
                                service.uploadFile(model.file, Upload, $scope.uploadFileInfo.url).then(
                                // file is uploaded successfully
                                function (response) {
                                    if (response.status == 200) {
                                        $scope.fileUploadedSuccess = true;
                                        $scope.elementId = model.elementId;
                                        $scope.progress = 100;
                                        model.numberOfChangeFileUploaded = model.numberOfChangeFileUploaded + 1;
                                        $scope.numberOfChangeFileUploaded = model.numberOfChangeFileUploaded;
                                        model.fileArray.push(response.filename);
                                        model.extensionsArray.push(model.uploadedFileExtension);
                                        angular.element("span.disable-file").hide();
                                        angular.element("div.progress>").css("width", "" + $scope.progress + "%");
                                        angular.element("div.progress").eq(model.fileArray.length - 1).removeClass("progress-striped active");
                                        angular.element("a.del-file").removeClass("ng-hide");
                                        $scope.uploadFileInfo.numberOfFileAllowed = $scope.numberOfFileAllowedInAction;

                                        switch ($scope.isPreviouslyFileUploaded) {
                                            case true:
                                                $scope.isDisableButton = false;
                                                $scope.IsDisableFileUploadBtn = ($scope.filenames.join(",").indexOf(".zip") > 0 && $scope.filenames.join(",").indexOf(".csv") > 0) ? true : false;
                                                break;
                                            case false:

                                                $scope.isDisableButton = (model.extensionsArray.indexOf("zip") >= 0 && model.form.data != null && model.form.data.assignto != null && model.form.data.assignto.toString().length > 0) ? false : true;
                                                if ($scope.numberOfChangeFileUploaded >= $scope.uploadFileInfo.numberOfFileAllowed)
                                                    $scope.IsDisableFileUploadBtn = true;
                                                else
                                                    $scope.IsDisableFileUploadBtn = false;

                                                $scope.IsDisableFileUploadBtn = ($scope.filenames.join(",").indexOf(".zip") > 0 && $scope.filenames.join(",").indexOf(".csv") > 0) ? true : false;
                                                break;
                                        }
                                    }
                                    else {
                                        angular.element("div.upload-file").eq(model.fileArray.length).remove();
                                        sweetAlert({
                                            title: "Error!",
                                            text: "Please upload correct file.",
                                            type: "error"
                                        });
                                        return false;
                                    }
                                },
                             function (resp) {
                                 // handle error
                             }, function (evt) {
                                 // progress notify                 
                                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                 if (progressPercentage == 100)
                                     $scope.progress = 90;
                                 else
                                     $scope.progress = progressPercentage;
                                 angular.element("." + $scope.uploadFileInfo.nameOfClass + "").children("div.progress").eq(model.extensionsArray.length).children().css("width", "" + $scope.progress + "%");
                             });
                                break;

                            }
                            else
                                return false;
                            break;
                        case "others":

                            if ($scope.numberOfChangeFileUploaded < 1) {
                                var prg = '<div class="progress-striped active progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + $scope.progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + $scope.progress + '%"><span class="sr-only">' + $scope.progress + '% Complete (success)</span></div></div>';
                                var template = "<div id=" + (model.elementId) + " class='upload-file'><span class='uploadfile-name' title='" + model.file.name + "'>" + model.file.name + "</span><span class='txtsm pull-left'>- " + filesize + "</span><span class='glyphicon glyphicon-trash ng-scope disable-file'></span><a class='glyphicon glyphicon-trash del-file' ng-hide='true' ng-click='delete(" + model.elementId + ")'></a>" + prg + "</div>";
                                var linkFn = $compile(template);
                                var content = linkFn($scope);
                                angular.element("#" + $scope.uploadFileInfo.appendFileToDiv + "").append(content);
                                service.uploadFile(model.file, Upload, $scope.uploadFileInfo.url).then(
                                // file is uploaded successfully
                                function (response) {
                                    if (response.status == 200) {
                                        $scope.elementId = model.elementId;
                                        $scope.progress = 100;
                                        model.numberOfChangeFileUploaded = model.numberOfChangeFileUploaded + 1;
                                        $scope.numberOfChangeFileUploaded = model.numberOfChangeFileUploaded;
                                        model.fileArray.push(response.filename);
                                        model.extensionsArray.push(model.uploadedFileExtension);
                                        angular.element("span.disable-file").hide();
                                        angular.element("div.progress>").css("width", "" + $scope.progress + "%");
                                        angular.element("div.progress").eq(model.fileArray.length - 1).removeClass("progress-striped active");
                                        angular.element("a.del-file").removeClass("ng-hide");

                                        $scope.uploadFileInfo.numberOfFileAllowed = $scope.numberOfFileAllowedInAction;
                                        if ($scope.numberOfChangeFileUploaded >= $scope.uploadFileInfo.numberOfFileAllowed) {
                                            $scope.IsDisableFileUploadBtn = true;
                                            $scope.isDisableButton = false;
                                        }
                                        else {
                                            $scope.isDisableButton = false;
                                            $scope.IsDisableFileUploadBtn = false;
                                        }
                                    }
                                    else {
                                        angular.element("div.upload-file").eq(model.fileArray.length).remove();
                                        sweetAlert({
                                            title: "Error!",
                                            text: "Please upload correct file.",
                                            type: "error"
                                        });
                                        return false;
                                    }
                                },
                             function (resp) {
                                 // handle error
                             }, function (evt) {
                                 // progress notify                 
                                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                 if (progressPercentage == 100)
                                     $scope.progress = 90;
                                 else
                                     $scope.progress = progressPercentage;
                                 angular.element("." + $scope.uploadFileInfo.nameOfClass + "").children("div.progress").eq(model.extensionsArray.length).children().css("width", "" + $scope.progress + "%");
                             });
                                break;

                            }
                            else
                                return false;
                            break;
                    }
                }
                else {
                    $scope.elementId = $scope.elementId - 1;
                    $scope.fileuploadederror = true;
                    $scope.error = "." + model.uploadedFileExtension + " files are not allowed to upload.";
                    return false;
                }
                return true;
                break;

        }

    },

    //common function for deleting one file at a time
    deleteUploadedFile: function ($scope, item, type) {

        delete $scope.uploadedFileExtension[item];
        delete $scope.filenames[item];
        angular.forEach(angular.element("div.upload-file"), function (divItem, index) {
            if (parseInt(divItem.id) == item) {
                angular.element("div").find("div.upload-file#" + parseInt(divItem.id) + "").slideUp();
                return false;
            }
        })
        //angular.element("div.upload-file").eq(parseInt(item)).slideUp();

        switch (type) {
            case "zip":
                $scope.numberOfZipFilesUploaded = $scope.numberOfZipFilesUploaded > 0 ? ($scope.numberOfZipFilesUploaded - 1) : 0;
                break;
            case "supporting":
                $scope.numberOfSupportingFilesUploaded = $scope.numberOfSupportingFilesUploaded > 0 ? ($scope.numberOfSupportingFilesUploaded - 1) : 0;
                break;
            case "change":

                $scope.numberOfChangeFileUploaded = $scope.numberOfChangeFileUploaded > 0 ? ($scope.numberOfChangeFileUploaded - 1) : 0;
                if ($scope.numberOfChangeFileUploaded == $scope.uploadFileInfo.numberOfFileAllowed) {
                    $scope.isDisableButton = false;
                    $scope.IsDisableFileUploadBtn = true;
                }
                else {
                    $scope.isDisableButton = true;
                    $scope.IsDisableFileUploadBtn = false;
                }
                break;
            case "zip_qaready":

                $scope.numberOfChangeFileUploaded = $scope.numberOfChangeFileUploaded > 0 ? ($scope.numberOfChangeFileUploaded - 1) : 0;
                if ($scope.numberOfChangeFileUploaded == $scope.uploadFileInfo.numberOfFileAllowed) {
                    $scope.isDisableButton = false;
                    $scope.IsDisableFileUploadBtn = true;
                }
                else {
                    $scope.isDisableButton = true;
                    $scope.IsDisableFileUploadBtn = false;
                }
                var zipFile = $scope.filenames.filter(function (file) {

                    return file.indexOf(".zip") > 0 ? true : false;
                });

                if (zipFile.length > 0) {
                    angular.element("#fromFTP").addClass("disable-filter");
                    $scope.isDisableButton = false;
                }
                else {
                    angular.element("#fromFTP").select2("val", "");
                    $scope.isDisableButton = true;
                }
                $scope.isDisableButton = $scope.isPreviouslyFileUploaded ? false : true;
                break;
        }


        //$scope.numberOfFilesUploaded = $scope.numberOfFilesUploaded > 0 ? ($scope.numberOfFilesUploaded - 1) : 0;
    },

    //common paging function for reportsListing
    commonReportsPaging: function ($rootScope, $scope, service, url, method, params) {

        service.GetReportsList(url, method, params).then(function (response) {
            if (response.status == 200) {
                var reports = JSON.parse(response.reports);
                if (response.status == 200) {
                    $scope.maxSize = 5;
                    $scope.bigCurrentPage = params.page;
                    $scope.bigTotalItems = reports.totalresults;
                    $scope.isShowPaging = reports.totalresults > 5 ? true : false;
                    var showAction = ShowAction(reports.result, $rootScope);
                    $scope.reports = showAction;
                    $("#loading").hide();
                }
                else {
                    $scope.reports = null;
                    $("#reportsDiv").hide();
                    $("#downloadPlusReportsDiv").hide();
                    $("#loading").hide();
                }
            }
            else {
                $scope.reports = null;
                $("#reportsDiv").hide();
                $("#downloadPlusReportsDiv").hide();
                $("#loading").hide();
            }
            $scope.showloader = false;
        })
    },

    //common function for get global search option
    getData: function ($rootScope) {
        var query = "";
        
        var searchedData = [];
        var optionSelectedForSearch = $("#globalsearchselect2option option:selected").val();
        switch (optionSelectedForSearch) {
            case "1":
                query = $("#query").val();
                break;
            case "2":
                query = $("#query").val();
                break;
            case "3":
                query = $("#query").val();
                break;
            case "4":
                query = $("#userlist option:selected").val();
                break;
            case "5":
                query = $rootScope.SelectedStatusString;
                break;
            case "6":
                query = $("#dptypelist option:selected").val();
                break;
            default:
                break;
        }
        searchedData.push({ optionSelectedForSearch: optionSelectedForSearch });
        searchedData.push({ query: query });
        return searchedData;
    },

    //common function for formating user result
    formatUsers: function ($rootScope, response) {

        var resultList = {};
        var usersobject = JSON.parse(response.data);
        if (response.status == 200) {

            resultList = {
                userslist: usersobject,
                statuscode: 200
            };
        }

        else {
            resultList = { dataprojects: null, statuscode: 400 };
        }
        return resultList;
    },

    //common function for getting files listing from ftp
    getFilesListingFromFtp: function ($scope, service, url) {
        //service call to get file from ftp
        service.GetFilesListingFromFtp(url)
        .then(
            function (response) {
                var data = JSON.parse(response.data);

                if (data.statuscode == 200 && data.result != undefined && data.result.length > 0) {
                    angular.forEach(data.result, function (file, index) {
                        if (file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase() == "zip") {
                            var fs = parseInt(file.size);
                            switch (true) {
                                case (fs < 1024):
                                    file.csize = fs + " bytes";
                                    break;
                                case (fs >= 1024 && fs < 1048576):
                                    file.csize = Math.round(fs / 1024) + " KB";
                                    break;
                                case (fs >= 1048576 && fs < 1073741824):
                                    file.csize = Math.round(fs / 1048576) + " MB";
                                    break;
                                case (fs >= 1073741824):
                                    file.csize = Math.round(fs / 1073741824) + " GB";
                                    break;
                            }
                            //csize = ((parseInt(file.size)) / (1024 * 1024)) > 1024 ? file.size + " GB" : file.size + " MB";
                            $scope.FtpFilesList.push(file);
                        }
                    })
                }
                else {
                    $scope.FtpFilesList = [];
                    $scope.isDisabled = true;
                    $scope.FtpFilesList.push({ "name": "No files found on ftp.", "isDisabled": true });
                }
            }
        )
    },
    //common function for file size and units
    getFileSizeWithUnit : function(file){        
        switch (true) {
            case (file.size < 1024):
                file.csize = file.size + " bytes";
                break;
            case (file.size >= 1024 && file.size < 1048576):
                file.csize = Math.round(file.size / 1024) + " KB";
                break;
            case (file.size >= 1048576 && file.size < 1073741824):
                file.csize = Math.round(file.size / 1048576) + " MB";
                break;
            case (file.size >= 1073741824):
                file.csize = Math.round(file.size / 1073741824) + " GB";
                break;
        }
        return file;
    },
    //common function to split a string with extension and comma
    getFilNamesWithExt: function (allowedExtensions, filenames) {
        var newArray = [];
        var fileNames = filenames.split(",");
        var tempArray = []
        var tmpFile = "";
        var prevIndex = 0;
        var prevFileAdded = false;
        angular.forEach(fileNames, function (value, index) {
            prevFileAdded = false;
            prevIndex = index;
            angular.forEach(allowedExtensions, function (ext, i) {
                var element = "." + ext;
                if (value.indexOf(element) != -1) {
                    tmpFile = tempArray.join(",") + ",extractfromhere;";
                    newArray.push(tmpFile);
                    tempArray = [];
                    tmpFile = "";
                    prevIndex = 0;
                    prevFileAdded = true;
                    return false;
                }
                else if (i == 0) {
                    tempArray.push(value);
                    return false;
                }
            })
            return false;
        })
        return newArray;
    }
}