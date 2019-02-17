'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">client documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link">AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' : 'data-target="#xs-components-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' :
                                            'id="xs-components-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' }>
                                            <li class="link">
                                                <a href="components/ExternalLoginCallbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExternalLoginCallbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PassResetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PassResetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterExternalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterExternalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThankYouComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ThankYouComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' : 'data-target="#xs-injectables-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' :
                                        'id="xs-injectables-links-module-AccountModule-eccf60b0c0a7911b9e0efdacf39553cb"' }>
                                        <li class="link">
                                            <a href="injectables/AccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AccountService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccountRoutingModule.html" data-type="entity-link">AccountRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AddressModule.html" data-type="entity-link">AddressModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AddressModule-100ac5c9e9a937ebfad5630028ff32cf"' : 'data-target="#xs-components-links-module-AddressModule-100ac5c9e9a937ebfad5630028ff32cf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AddressModule-100ac5c9e9a937ebfad5630028ff32cf"' :
                                            'id="xs-components-links-module-AddressModule-100ac5c9e9a937ebfad5630028ff32cf"' }>
                                            <li class="link">
                                                <a href="components/AddressComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddressReadOnlyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddressReadOnlyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-32481f47b06e2dabbdd46e1bd19d4d81"' : 'data-target="#xs-components-links-module-AppModule-32481f47b06e2dabbdd46e1bd19d4d81"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-32481f47b06e2dabbdd46e1bd19d4d81"' :
                                            'id="xs-components-links-module-AppModule-32481f47b06e2dabbdd46e1bd19d4d81"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-cd680bee7ada03046500e023aba5b893"' : 'data-target="#xs-injectables-links-module-CoreModule-cd680bee7ada03046500e023aba5b893"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-cd680bee7ada03046500e023aba5b893"' :
                                        'id="xs-injectables-links-module-CoreModule-cd680bee7ada03046500e023aba5b893"' }>
                                        <li class="link">
                                            <a href="injectables/AddressService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AddressService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConfigurationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigurationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HttpErrorHandlerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HttpErrorHandlerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoaderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LoaderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MessageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/Settings.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Settings</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserAddressService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserAddressService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FormFieldsModule.html" data-type="entity-link">FormFieldsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' : 'data-target="#xs-components-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' :
                                            'id="xs-components-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                            <li class="link">
                                                <a href="components/InputGroupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InputSimpleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputSimpleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimePickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' : 'data-target="#xs-directives-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' :
                                        'id="xs-directives-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                        <li class="link">
                                            <a href="directives/CountriesDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">CountriesDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' : 'data-target="#xs-pipes-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' :
                                            'id="xs-pipes-links-module-FormFieldsModule-40267b8a1fdcaa9fa0aea60bf0a69ee0"' }>
                                            <li class="link">
                                                <a href="pipes/DateFormatPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateFormatPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LimitToPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LimitToPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FormValidationModule.html" data-type="entity-link">FormValidationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' : 'data-target="#xs-components-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' :
                                            'id="xs-components-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' }>
                                            <li class="link">
                                                <a href="components/EmailValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmailValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MaxLengthValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MaxLengthValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MinLengthValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MinLengthValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatternValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatternValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RequiredValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequiredValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimeValidationErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeValidationErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidationErrorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidationErrorsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' : 'data-target="#xs-directives-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' :
                                        'id="xs-directives-links-module-FormValidationModule-3b9d1e54db7f458b2f6e5749d7783760"' }>
                                        <li class="link">
                                            <a href="directives/EmailValidator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmailValidator</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TimeValidator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeValidator</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImageSliderModule.html" data-type="entity-link">ImageSliderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ImageSliderModule-595157420867ec83981af243fce06ce3"' : 'data-target="#xs-components-links-module-ImageSliderModule-595157420867ec83981af243fce06ce3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ImageSliderModule-595157420867ec83981af243fce06ce3"' :
                                            'id="xs-components-links-module-ImageSliderModule-595157420867ec83981af243fce06ce3"' }>
                                            <li class="link">
                                                <a href="components/BgImageSliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BgImageSliderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImageSliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImageSliderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MeetingsModule.html" data-type="entity-link">MeetingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' : 'data-target="#xs-components-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' :
                                            'id="xs-components-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' }>
                                            <li class="link">
                                                <a href="components/EditEventComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JqxSchedulerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JqxSchedulerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JqxSchedulerTestComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JqxSchedulerTestComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MeetingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MeetingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviewEventComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreviewEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecurringEventComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RecurringEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TestTimeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TestTimeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' : 'data-target="#xs-injectables-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' :
                                        'id="xs-injectables-links-module-MeetingsModule-c73c14c10f13702cefd77366d133994b"' }>
                                        <li class="link">
                                            <a href="injectables/EventService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EventService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventsQueryService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EventsQueryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SchedulerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SchedulerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MeetingsRoutingModule.html" data-type="entity-link">MeetingsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MinicalModule.html" data-type="entity-link">MinicalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' : 'data-target="#xs-components-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' :
                                            'id="xs-components-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' }>
                                            <li class="link">
                                                <a href="components/MinicalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MinicalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' : 'data-target="#xs-directives-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' :
                                        'id="xs-directives-links-module-MinicalModule-2e1beb74306c3437260199643b4f8d1a"' }>
                                        <li class="link">
                                            <a href="directives/EventDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/GroupDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">GroupDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulerModule.html" data-type="entity-link">SchedulerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' : 'data-target="#xs-components-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' :
                                            'id="xs-components-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' }>
                                            <li class="link">
                                                <a href="components/CalendarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalendarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JqxSchedulerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JqxSchedulerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' : 'data-target="#xs-directives-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' :
                                        'id="xs-directives-links-module-SchedulerModule-d26fd9f026f7e63e7fa8bb8dd6233c9d"' }>
                                        <li class="link">
                                            <a href="directives/SchedulerEditSeletedEventTemplateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerEditSeletedEventTemplateDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SchedulerEventTemplateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerEventTemplateDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SchedulerReadSeletedEventTemplateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerReadSeletedEventTemplateDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-2329b9f1dc65744e52c12491f29b0142"' : 'data-target="#xs-components-links-module-SharedModule-2329b9f1dc65744e52c12491f29b0142"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-2329b9f1dc65744e52c12491f29b0142"' :
                                            'id="xs-components-links-module-SharedModule-2329b9f1dc65744e52c12491f29b0142"' }>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpinnerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SpinnerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/swMapModule.html" data-type="entity-link">swMapModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/SchedulerComponent-1.html" data-type="entity-link">SchedulerComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/EventDirective-1.html" data-type="entity-link">EventDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/Address-1.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/AmplifyLocalStorage.html" data-type="entity-link">AmplifyLocalStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppLocalStorage.html" data-type="entity-link">AppLocalStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUser.html" data-type="entity-link">AuthUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Configuration.html" data-type="entity-link">Configuration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Country.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="classes/Country-1.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateApplicationUserModel.html" data-type="entity-link">CreateApplicationUserModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateExternalApplicationUserModel.html" data-type="entity-link">CreateExternalApplicationUserModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserModel.html" data-type="entity-link">CreateUserModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateFormat.html" data-type="entity-link">DateFormat</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventDto.html" data-type="entity-link">EventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventGroup.html" data-type="entity-link">EventGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventViewModel.html" data-type="entity-link">EventViewModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExternalLoginModel.html" data-type="entity-link">ExternalLoginModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeolocationResult.html" data-type="entity-link">GeolocationResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageInfo.html" data-type="entity-link">ImageInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocationDto.html" data-type="entity-link">LocationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginViewModel.html" data-type="entity-link">LoginViewModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecurringEventViewModel.html" data-type="entity-link">RecurringEventViewModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScriptLoaderService.html" data-type="entity-link">ScriptLoaderService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeRange.html" data-type="entity-link">TimeRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeRangeDto.html" data-type="entity-link">TimeRangeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationErrorComponent.html" data-type="entity-link">ValidationErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationTypeDecorator.html" data-type="entity-link">ValidationTypeDecorator</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountService.html" data-type="entity-link">AccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AddressService.html" data-type="entity-link">AddressService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarService.html" data-type="entity-link">CalendarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link">ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailBlackList.html" data-type="entity-link">EmailBlackList</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventService.html" data-type="entity-link">EventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsQueryService.html" data-type="entity-link">EventsQueryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GeolocationService.html" data-type="entity-link">GeolocationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpErrorHandlerService.html" data-type="entity-link">HttpErrorHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoaderService.html" data-type="entity-link">LoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MapsApiLoaderService.html" data-type="entity-link">MapsApiLoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link">MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MinicalService.html" data-type="entity-link">MinicalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchedulerService.html" data-type="entity-link">SchedulerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchedulerService-1.html" data-type="entity-link">SchedulerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Settings.html" data-type="entity-link">Settings</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Storage.html" data-type="entity-link">Storage</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAddressService.html" data-type="entity-link">UserAddressService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/UrlInterceptor.html" data-type="entity-link">UrlInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/EventArgs.html" data-type="entity-link">EventArgs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventInfo.html" data-type="entity-link">EventInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventInfo-1.html" data-type="entity-link">EventInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JqxCalendar.html" data-type="entity-link">JqxCalendar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapApiConfig.html" data-type="entity-link">MapApiConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});