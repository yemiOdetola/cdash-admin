(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{b58B:function(t,e,o){"use strict";var n=o("CcnG"),a=o("bujt"),l=o("UodH"),r=o("dWZg"),d=o("lLAP"),u=o("wFw1"),p=o("Mr+X"),i=o("SMsm"),c=o("Ip0R"),M=o("VEDv"),s=n.\u0275crt({encapsulation:2,styles:[],data:{}});function m(t){return n.\u0275vid(0,[(t()(),n.\u0275eld(0,0,null,null,5,"div",[["class","kt-mat-alert__close"]],null,null,null,null,null)),(t()(),n.\u0275eld(1,0,null,null,4,"button",[["color","warn"],["mat-icon-button",""],["type","button"]],[[8,"disabled",0],[2,"_mat-animation-noopable",null]],[[null,"click"]],function(t,e,o){var n=!0;return"click"===e&&(n=!1!==t.component.closeAlert()&&n),n},a.View_MatButton_0,a.RenderType_MatButton)),n.\u0275did(2,180224,null,0,l.MatButton,[n.ElementRef,r.Platform,d.FocusMonitor,[2,u.ANIMATION_MODULE_TYPE]],{color:[0,"color"]},null),(t()(),n.\u0275eld(3,0,null,0,2,"mat-icon",[["class","material-icons mat-icon notranslate"],["role","img"]],[[2,"mat-icon-inline",null],[2,"mat-icon-no-color",null]],null,null,p.View_MatIcon_0,p.RenderType_MatIcon)),n.\u0275did(4,9158656,null,0,i.MatIcon,[n.ElementRef,i.MatIconRegistry,[8,null],[2,i.MAT_ICON_LOCATION]],null,null),(t()(),n.\u0275ted(-1,0,["clear"]))],function(t,e){t(e,2,0,"warn"),t(e,4,0)},function(t,e){t(e,1,0,n.\u0275nov(e,2).disabled||null,"NoopAnimations"===n.\u0275nov(e,2)._animationMode),t(e,3,0,n.\u0275nov(e,4).inline,"primary"!==n.\u0275nov(e,4).color&&"accent"!==n.\u0275nov(e,4).color&&"warn"!==n.\u0275nov(e,4).color)})}function _(t){return n.\u0275vid(0,[(t()(),n.\u0275eld(0,0,null,null,6,"div",[["role","alert"]],[[8,"className",0]],null,null,null,null)),(t()(),n.\u0275eld(1,0,null,null,1,"div",[["class","kt-mat-alert__icon"]],null,null,null,null,null)),(t()(),n.\u0275eld(2,0,null,null,0,"i",[["class","la la-warning"]],null,null,null,null,null)),(t()(),n.\u0275eld(3,0,null,null,1,"div",[["class","kt-mat-alert__text"]],null,null,null,null,null)),n.\u0275ncd(null,0),(t()(),n.\u0275and(16777216,null,null,1,null,m)),n.\u0275did(6,16384,null,0,c.NgIf,[n.ViewContainerRef,n.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(t,e){t(e,6,0,e.component.showCloseButton)},function(t,e){t(e,0,0,n.\u0275inlineInterpolate(1,"kt-mat-alert  kt-mat-alert--",e.component.type,""))})}function g(t){return n.\u0275vid(0,[(t()(),n.\u0275eld(0,0,null,null,1,"kt-alert",[],null,null,null,_,s)),n.\u0275did(1,114688,null,0,M.AlertComponent,[],null,null)],function(t,e){t(e,1,0)},null)}e.RenderType_AlertComponent=s,e.View_AlertComponent_0=_,e.View_AlertComponent_Host_0=g,e.AlertComponentNgFactory=n.\u0275ccf("kt-alert",M.AlertComponent,g,{type:"type",duration:"duration",showCloseButton:"showCloseButton"},{close:"close"},["*"])},"hR/J":function(t,e,o){"use strict";o.r(e),o.d(e,"MomentDateModule",function(){return s}),o.d(e,"MatMomentDateModule",function(){return m}),o.d(e,"MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY",function(){return p}),o.d(e,"MAT_MOMENT_DATE_ADAPTER_OPTIONS",function(){return u}),o.d(e,"MomentDateAdapter",function(){return c}),o.d(e,"MAT_MOMENT_DATE_FORMATS",function(){return M});var n=o("mrSG"),a=o("CcnG"),l=o("Wf4p"),r=o("wd/R"),d=o.n(r).a||r,u=new a.InjectionToken("MAT_MOMENT_DATE_ADAPTER_OPTIONS",{providedIn:"root",factory:p});function p(){return{useUtc:!1}}function i(t,e){for(var o=Array(t),n=0;n<t;n++)o[n]=e(n);return o}var c=function(t){function e(e,o){var n=t.call(this)||this;return n.options=o,n.setLocale(e||d.locale()),n}return Object(n.__extends)(e,t),e.prototype.setLocale=function(e){var o=this;t.prototype.setLocale.call(this,e);var n=d.localeData(e);this._localeData={firstDayOfWeek:n.firstDayOfWeek(),longMonths:n.months(),shortMonths:n.monthsShort(),dates:i(31,function(t){return o.createDate(2017,0,t+1).format("D")}),longDaysOfWeek:n.weekdays(),shortDaysOfWeek:n.weekdaysShort(),narrowDaysOfWeek:n.weekdaysMin()}},e.prototype.getYear=function(t){return this.clone(t).year()},e.prototype.getMonth=function(t){return this.clone(t).month()},e.prototype.getDate=function(t){return this.clone(t).date()},e.prototype.getDayOfWeek=function(t){return this.clone(t).day()},e.prototype.getMonthNames=function(t){return"long"==t?this._localeData.longMonths:this._localeData.shortMonths},e.prototype.getDateNames=function(){return this._localeData.dates},e.prototype.getDayOfWeekNames=function(t){return"long"==t?this._localeData.longDaysOfWeek:"short"==t?this._localeData.shortDaysOfWeek:this._localeData.narrowDaysOfWeek},e.prototype.getYearName=function(t){return this.clone(t).format("YYYY")},e.prototype.getFirstDayOfWeek=function(){return this._localeData.firstDayOfWeek},e.prototype.getNumDaysInMonth=function(t){return this.clone(t).daysInMonth()},e.prototype.clone=function(t){return t.clone().locale(this.locale)},e.prototype.createDate=function(t,e,o){if(e<0||e>11)throw Error('Invalid month index "'+e+'". Month index has to be between 0 and 11.');if(o<1)throw Error('Invalid date "'+o+'". Date has to be greater than 0.');var n=this._createMoment({year:t,month:e,date:o}).locale(this.locale);if(!n.isValid())throw Error('Invalid date "'+o+'" for month with index "'+e+'".');return n},e.prototype.today=function(){return this._createMoment().locale(this.locale)},e.prototype.parse=function(t,e){return t&&"string"==typeof t?this._createMoment(t,e,this.locale):t?this._createMoment(t).locale(this.locale):null},e.prototype.format=function(t,e){if(t=this.clone(t),!this.isValid(t))throw Error("MomentDateAdapter: Cannot format invalid date.");return t.format(e)},e.prototype.addCalendarYears=function(t,e){return this.clone(t).add({years:e})},e.prototype.addCalendarMonths=function(t,e){return this.clone(t).add({months:e})},e.prototype.addCalendarDays=function(t,e){return this.clone(t).add({days:e})},e.prototype.toIso8601=function(t){return this.clone(t).format()},e.prototype.deserialize=function(e){var o;if(e instanceof Date)o=this._createMoment(e).locale(this.locale);else if(this.isDateInstance(e))return this.clone(e);if("string"==typeof e){if(!e)return null;o=this._createMoment(e,d.ISO_8601).locale(this.locale)}return o&&this.isValid(o)?this._createMoment(o).locale(this.locale):t.prototype.deserialize.call(this,e)},e.prototype.isDateInstance=function(t){return d.isMoment(t)},e.prototype.isValid=function(t){return this.clone(t).isValid()},e.prototype.invalid=function(){return d.invalid()},e.prototype._createMoment=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return this.options&&this.options.useUtc?d.utc.apply(d,t):d.apply(void 0,t)},e}(l.DateAdapter),M={parse:{dateInput:"l"},display:{dateInput:"l",monthYearLabel:"MMM YYYY",dateA11yLabel:"LL",monthYearA11yLabel:"MMMM YYYY"}},s=function(){return function(){}}(),m=function(){return function(){}}()},v7c8:function(t,e,o){"use strict";var n=o("CcnG"),a=o("xb0o"),l=o("pMnS"),r=o("9AJC"),d=o("yBPo"),u=o("NcP4"),p=o("t68o"),i=o("zbXB"),c=o("xYTU"),M=o("zDpy"),s=o("51Eg"),m=o("p1An"),_=o("pUs0"),g=o("wa4b"),T=o("aNaC"),h=o("+uY1"),y=o("76J0"),A=o("DF0R"),f=o("Ip0R"),C=o("t/Na"),O=o("Loxy"),N=o("gIcY"),D=o("4GxJ"),R=o("eDkP"),S=o("Fzqc"),E=o("M2Lx"),v=o("uGex"),b=o("v9Dh"),I=o("ZYjt"),k=o("Wf4p"),L=o("4epT"),F=o("OkvK"),P=o("mVsa"),Y=o("4tE/"),w=o("dWZg"),H=o("o3x0"),G=o("jQLj"),B=o("/qR0"),U=o("wmQ5"),V=o("fHFU"),x=o("yGQT"),W=o("ZYCi"),X=o("1WZ6"),j=o("COYw"),K=o("rXkx"),Z=o("vARd"),z=o("k10Y"),q=o("bse0"),J=o("0ibv"),Q=o("pKmL"),$=o("Blfk"),tt=o("Z+uX"),et=o("islZ"),ot=o("y4qS"),nt=o("BHnd"),at=o("SMsm"),lt=o("UodH"),rt=o("4c35"),dt=o("qAlS"),ut=o("seP3"),pt=o("lLAP"),it=o("9qNs"),ct=o("/VYK"),Mt=o("b716"),st=o("9It4"),mt=o("FVSy"),_t=o("de3e"),gt=o("La40"),Tt=o("E6Rk"),ht=o("Lwpp"),yt=o("E+HK"),At=o("5dk6"),ft=o("ROaP"),Ct=o("5m/d");e.AssetsModuleNgFactory=n.\u0275cmf(a.AssetsModule,[],function(t){return n.\u0275mod([n.\u0275mpd(512,n.ComponentFactoryResolver,n.\u0275CodegenComponentFactoryResolver,[[8,[l.\u0275EmptyOutletComponentNgFactory,r.NgbAlertNgFactory,r.NgbDatepickerNgFactory,r.\u0275uNgFactory,r.\u0275vNgFactory,r.\u0275nNgFactory,r.\u0275qNgFactory,r.\u0275rNgFactory,d.InlineSVGComponentNgFactory,u.TooltipComponentNgFactory,p.MatDialogContainerNgFactory,i.MatDatepickerContentNgFactory,i.MatCalendarHeaderNgFactory,c.MatSnackBarContainerNgFactory,c.SimpleSnackBarNgFactory,M.ChangePasswordDialogComponentNgFactory,s.AssetsComponentNgFactory,m.AssetsListComponentNgFactory,_.AssetEditComponentNgFactory,g.AssetComponentNgFactory,T.ActionNotificationComponentNgFactory,h.DeleteEntityDialogComponentNgFactory,y.FetchEntityDialogComponentNgFactory,A.UpdateStatusDialogComponentNgFactory]],[3,n.ComponentFactoryResolver],n.NgModuleRef]),n.\u0275mpd(4608,f.NgLocalization,f.NgLocaleLocalization,[n.LOCALE_ID,[2,f.\u0275angular_packages_common_common_a]]),n.\u0275mpd(4608,C.HttpXsrfTokenExtractor,C.\u0275angular_packages_common_http_http_g,[f.DOCUMENT,n.PLATFORM_ID,C.\u0275angular_packages_common_http_http_e]),n.\u0275mpd(4608,C.\u0275angular_packages_common_http_http_h,C.\u0275angular_packages_common_http_http_h,[C.HttpXsrfTokenExtractor,C.\u0275angular_packages_common_http_http_f]),n.\u0275mpd(5120,C.HTTP_INTERCEPTORS,function(t){return[t,new O.InterceptService]},[C.\u0275angular_packages_common_http_http_h]),n.\u0275mpd(4608,C.\u0275angular_packages_common_http_http_d,C.\u0275angular_packages_common_http_http_d,[]),n.\u0275mpd(6144,C.XhrFactory,null,[C.\u0275angular_packages_common_http_http_d]),n.\u0275mpd(4608,C.HttpXhrBackend,C.HttpXhrBackend,[C.XhrFactory]),n.\u0275mpd(6144,C.HttpBackend,null,[C.HttpXhrBackend]),n.\u0275mpd(4608,C.HttpHandler,C.\u0275HttpInterceptingHandler,[C.HttpBackend,n.Injector]),n.\u0275mpd(4608,C.HttpClient,C.HttpClient,[C.HttpHandler]),n.\u0275mpd(4608,N.\u0275angular_packages_forms_forms_j,N.\u0275angular_packages_forms_forms_j,[]),n.\u0275mpd(4608,N.FormBuilder,N.FormBuilder,[]),n.\u0275mpd(4608,D.NgbModal,D.NgbModal,[n.ComponentFactoryResolver,n.Injector,D.\u0275w,D.NgbModalConfig]),n.\u0275mpd(4608,R.Overlay,R.Overlay,[R.ScrollStrategyOptions,R.OverlayContainer,n.ComponentFactoryResolver,R.OverlayPositionBuilder,R.OverlayKeyboardDispatcher,n.Injector,n.NgZone,f.DOCUMENT,S.Directionality,[2,f.Location]]),n.\u0275mpd(5120,R.\u0275c,R.\u0275d,[R.Overlay]),n.\u0275mpd(4608,E.MutationObserverFactory,E.MutationObserverFactory,[]),n.\u0275mpd(5120,v.MAT_SELECT_SCROLL_STRATEGY,v.MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,[R.Overlay]),n.\u0275mpd(5120,b.MAT_TOOLTIP_SCROLL_STRATEGY,b.MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,[R.Overlay]),n.\u0275mpd(4608,I.HAMMER_GESTURE_CONFIG,k.GestureConfig,[[2,k.MAT_HAMMER_OPTIONS],[2,k.MatCommonModule]]),n.\u0275mpd(5120,L.MatPaginatorIntl,L.MAT_PAGINATOR_INTL_PROVIDER_FACTORY,[[3,L.MatPaginatorIntl]]),n.\u0275mpd(5120,F.MatSortHeaderIntl,F.MAT_SORT_HEADER_INTL_PROVIDER_FACTORY,[[3,F.MatSortHeaderIntl]]),n.\u0275mpd(5120,P.MAT_MENU_SCROLL_STRATEGY,P.\u0275d24,[R.Overlay]),n.\u0275mpd(4608,k.ErrorStateMatcher,k.ErrorStateMatcher,[]),n.\u0275mpd(5120,Y.MAT_AUTOCOMPLETE_SCROLL_STRATEGY,Y.MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,[R.Overlay]),n.\u0275mpd(4608,k.DateAdapter,k.NativeDateAdapter,[[2,k.MAT_DATE_LOCALE],w.Platform]),n.\u0275mpd(5120,H.MAT_DIALOG_SCROLL_STRATEGY,H.MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,[R.Overlay]),n.\u0275mpd(135680,H.MatDialog,H.MatDialog,[R.Overlay,n.Injector,[2,f.Location],[2,H.MAT_DIALOG_DEFAULT_OPTIONS],H.MAT_DIALOG_SCROLL_STRATEGY,[3,H.MatDialog],R.OverlayContainer]),n.\u0275mpd(4608,G.MatDatepickerIntl,G.MatDatepickerIntl,[]),n.\u0275mpd(5120,G.MAT_DATEPICKER_SCROLL_STRATEGY,G.MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,[R.Overlay]),n.\u0275mpd(4608,B.AuthService,B.AuthService,[C.HttpClient]),n.\u0275mpd(5120,U.MatStepperIntl,U.MAT_STEPPER_INTL_PROVIDER_FACTORY,[[3,U.MatStepperIntl]]),n.\u0275mpd(4608,V.ModuleGuard,V.ModuleGuard,[x.Store,W.Router]),n.\u0275mpd(4608,X.HttpUtilsService,X.HttpUtilsService,[]),n.\u0275mpd(4608,j.TypesUtilsService,j.TypesUtilsService,[]),n.\u0275mpd(4608,O.InterceptService,O.InterceptService,[]),n.\u0275mpd(4608,K.LayoutUtilsService,K.LayoutUtilsService,[Z.MatSnackBar,H.MatDialog]),n.\u0275mpd(4608,z.AssetsService,z.AssetsService,[C.HttpClient,X.HttpUtilsService]),n.\u0275mpd(1073742336,f.CommonModule,f.CommonModule,[]),n.\u0275mpd(1073742336,C.HttpClientXsrfModule,C.HttpClientXsrfModule,[]),n.\u0275mpd(1073742336,C.HttpClientModule,C.HttpClientModule,[]),n.\u0275mpd(1073742336,W.RouterModule,W.RouterModule,[[2,W.\u0275angular_packages_router_router_a],[2,W.Router]]),n.\u0275mpd(1073742336,N.\u0275angular_packages_forms_forms_bc,N.\u0275angular_packages_forms_forms_bc,[]),n.\u0275mpd(1073742336,N.FormsModule,N.FormsModule,[]),n.\u0275mpd(1073742336,N.ReactiveFormsModule,N.ReactiveFormsModule,[]),n.\u0275mpd(1073742336,D.NgbAccordionModule,D.NgbAccordionModule,[]),n.\u0275mpd(1073742336,D.NgbAlertModule,D.NgbAlertModule,[]),n.\u0275mpd(1073742336,D.NgbButtonsModule,D.NgbButtonsModule,[]),n.\u0275mpd(1073742336,D.NgbCarouselModule,D.NgbCarouselModule,[]),n.\u0275mpd(1073742336,D.NgbCollapseModule,D.NgbCollapseModule,[]),n.\u0275mpd(1073742336,D.NgbDatepickerModule,D.NgbDatepickerModule,[]),n.\u0275mpd(1073742336,D.NgbDropdownModule,D.NgbDropdownModule,[]),n.\u0275mpd(1073742336,D.NgbModalModule,D.NgbModalModule,[]),n.\u0275mpd(1073742336,D.NgbPaginationModule,D.NgbPaginationModule,[]),n.\u0275mpd(1073742336,D.NgbPopoverModule,D.NgbPopoverModule,[]),n.\u0275mpd(1073742336,D.NgbProgressbarModule,D.NgbProgressbarModule,[]),n.\u0275mpd(1073742336,D.NgbRatingModule,D.NgbRatingModule,[]),n.\u0275mpd(1073742336,D.NgbTabsetModule,D.NgbTabsetModule,[]),n.\u0275mpd(1073742336,D.NgbTimepickerModule,D.NgbTimepickerModule,[]),n.\u0275mpd(1073742336,D.NgbTooltipModule,D.NgbTooltipModule,[]),n.\u0275mpd(1073742336,D.NgbTypeaheadModule,D.NgbTypeaheadModule,[]),n.\u0275mpd(1073742336,D.NgbModule,D.NgbModule,[]),n.\u0275mpd(1073742336,q.PerfectScrollbarModule,q.PerfectScrollbarModule,[]),n.\u0275mpd(1073742336,J.InlineSVGModule,J.InlineSVGModule,[]),n.\u0275mpd(1073742336,Q.CoreModule,Q.CoreModule,[]),n.\u0275mpd(1073742336,S.BidiModule,S.BidiModule,[]),n.\u0275mpd(1073742336,k.MatCommonModule,k.MatCommonModule,[[2,k.MATERIAL_SANITY_CHECKS],[2,I.HAMMER_LOADER]]),n.\u0275mpd(1073742336,$.MatProgressSpinnerModule,$.MatProgressSpinnerModule,[]),n.\u0275mpd(1073742336,tt.MatProgressBarModule,tt.MatProgressBarModule,[]),n.\u0275mpd(1073742336,et.PortletModule,et.PortletModule,[]),n.\u0275mpd(1073742336,ot.CdkTableModule,ot.CdkTableModule,[]),n.\u0275mpd(1073742336,nt.MatTableModule,nt.MatTableModule,[]),n.\u0275mpd(1073742336,at.MatIconModule,at.MatIconModule,[]),n.\u0275mpd(1073742336,w.PlatformModule,w.PlatformModule,[]),n.\u0275mpd(1073742336,k.MatRippleModule,k.MatRippleModule,[]),n.\u0275mpd(1073742336,lt.MatButtonModule,lt.MatButtonModule,[]),n.\u0275mpd(1073742336,rt.PortalModule,rt.PortalModule,[]),n.\u0275mpd(1073742336,dt.ScrollingModule,dt.ScrollingModule,[]),n.\u0275mpd(1073742336,R.OverlayModule,R.OverlayModule,[]),n.\u0275mpd(1073742336,k.MatPseudoCheckboxModule,k.MatPseudoCheckboxModule,[]),n.\u0275mpd(1073742336,k.MatOptionModule,k.MatOptionModule,[]),n.\u0275mpd(1073742336,E.ObserversModule,E.ObserversModule,[]),n.\u0275mpd(1073742336,ut.MatFormFieldModule,ut.MatFormFieldModule,[]),n.\u0275mpd(1073742336,v.MatSelectModule,v.MatSelectModule,[]),n.\u0275mpd(1073742336,pt.A11yModule,pt.A11yModule,[]),n.\u0275mpd(1073742336,b.MatTooltipModule,b.MatTooltipModule,[]),n.\u0275mpd(1073742336,L.MatPaginatorModule,L.MatPaginatorModule,[]),n.\u0275mpd(1073742336,F.MatSortModule,F.MatSortModule,[]),n.\u0275mpd(1073742336,it.WidgetModule,it.WidgetModule,[]),n.\u0275mpd(1073742336,P.MatMenuModule,P.MatMenuModule,[]),n.\u0275mpd(1073742336,ct.TextFieldModule,ct.TextFieldModule,[]),n.\u0275mpd(1073742336,Mt.MatInputModule,Mt.MatInputModule,[]),n.\u0275mpd(1073742336,Y.MatAutocompleteModule,Y.MatAutocompleteModule,[]),n.\u0275mpd(1073742336,st.MatRadioModule,st.MatRadioModule,[]),n.\u0275mpd(1073742336,k.NativeDateModule,k.NativeDateModule,[]),n.\u0275mpd(1073742336,k.MatNativeDateModule,k.MatNativeDateModule,[]),n.\u0275mpd(1073742336,H.MatDialogModule,H.MatDialogModule,[]),n.\u0275mpd(1073742336,G.MatDatepickerModule,G.MatDatepickerModule,[]),n.\u0275mpd(1073742336,mt.MatCardModule,mt.MatCardModule,[]),n.\u0275mpd(1073742336,_t.MatCheckboxModule,_t.MatCheckboxModule,[]),n.\u0275mpd(1073742336,Z.MatSnackBarModule,Z.MatSnackBarModule,[]),n.\u0275mpd(1073742336,gt.MatTabsModule,gt.MatTabsModule,[]),n.\u0275mpd(1073742336,Tt.PartialsModule,Tt.PartialsModule,[]),n.\u0275mpd(1073742336,ht.CdkStepperModule,ht.CdkStepperModule,[]),n.\u0275mpd(1073742336,U.MatStepperModule,U.MatStepperModule,[]),n.\u0275mpd(1073742336,a.AssetsModule,a.AssetsModule,[]),n.\u0275mpd(256,C.\u0275angular_packages_common_http_http_e,"XSRF-TOKEN",[]),n.\u0275mpd(256,C.\u0275angular_packages_common_http_http_f,"X-XSRF-TOKEN",[]),n.\u0275mpd(256,k.MAT_DATE_FORMATS,k.MAT_NATIVE_DATE_FORMATS,[]),n.\u0275mpd(256,H.MAT_DIALOG_DEFAULT_OPTIONS,a.\u02750,[]),n.\u0275mpd(1024,W.ROUTES,function(){return[[{path:"",component:yt.AssetsComponent,children:[{path:"",redirectTo:"assets",pathMatch:"full"},{path:"assets",component:At.AssetsListComponent,pathMatch:"full"},{path:"manage",component:ft.AssetEditComponent},{path:"manage/:id",component:ft.AssetEditComponent},{path:"asset/:id",component:Ct.AssetComponent}]}]]},[])])})}}]);