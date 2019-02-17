var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","component":"HomeComponent","canActivate":["AuthGuard"]},{"path":"account","loadChildren":"app/account/account.module#AccountModule","children":[{"kind":"module","children":[{"name":"accountRoutes","filename":"src/app/account/account-routing.module.ts","module":"AccountRoutingModule","children":[{"path":"login","component":"LoginComponent"},{"path":"register","component":"RegisterComponent"},{"path":"registerexternal/:provider/:name","component":"RegisterExternalComponent"},{"path":"thank-you/:email","component":"ThankYouComponent"},{"path":"externallogin","component":"ExternalLoginCallbackComponent"}],"kind":"module"}],"module":"AccountModule"}]},{"path":"meetings","loadChildren":"app/meetings/meetings.module#MeetingsModule","canLoad":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/meetings/meetings-routing.module.ts","module":"MeetingsRoutingModule","children":[{"path":"","component":"MeetingsComponent","children":[{"path":"","redirectTo":"m/calendar","pathMatch":"full"},{"path":"m/calendar","component":"JqxSchedulerComponent"},{"path":"m/calendar-test","component":"JqxSchedulerTestComponent"}]}],"kind":"module"}],"module":"MeetingsModule"}]}],"kind":"module"}]}
