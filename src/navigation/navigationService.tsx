export const handlePush = (nav: any) =>
  global.navRef.navigate(nav.name, nav.params);

export const handleReplace = (nav: any) =>
  global.navRef.replace(nav.name, nav.params);

export const handlePushToPage = (nav: any) =>
  global.navRef.push(nav.name, nav.params);

export const handleSetRoot = (nav: any) =>
  global.navRef.reset({
    index: 0,
    routes: [{name: nav.name, params: nav.params}],
  });

export const handleGoBack = (nav: any) => global.navRef.goBack();

export const handlePop = (nav: any) => global.navRef.popToTop();
