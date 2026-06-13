import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications
import PushKit
import RNBootSplash
import GoogleMaps

@main
class AppDelegate: RCTAppDelegate,
                   PKPushRegistryDelegate,
                   UNUserNotificationCenterDelegate,
                   MessagingDelegate {

  var wasLaunchedByVoIP: Bool = false
  var pendingVoIPPayload: [AnyHashable: Any]?
  static var shared: AppDelegate?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    AppDelegate.shared = self
    
    self.moduleName = "MediDoctorApp"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]
    GMSServices.provideAPIKey("AIzaSyCD4XfASHD3Ml6ow07DWjwXjFscRLK0DB0")
    
    // 🔹 Firebase
    FirebaseApp.configure()
    Messaging.messaging().delegate = self

    // 🔹 Notifications
    let center = UNUserNotificationCenter.current()
    center.delegate = self
    center.requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    application.registerForRemoteNotifications()

    // 🔹 VoIP
    RNVoipPushNotificationManager.voipRegistration()

    // 🔹 CallKeep
   RNCallKeep.setup([
     "appName": "MediDoctorApp",
     "supportsVideo": true,
     "includesCallsInRecents": true
   ])

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // MARK: - Deep Link Handling

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    print("🔗 Deep link opened: \(url)")
    
    NotificationCenter.default.post(
      name: NSNotification.Name("DeepLinkReceived"),
      object: nil,
      userInfo: ["url": url.absoluteString]
    )
    
    return true
  }

  override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let url = userActivity.webpageURL {
      print("🔗 Universal link opened: \(url)")
      
      NotificationCenter.default.post(
        name: NSNotification.Name("DeepLinkReceived"),
        object: nil,
        userInfo: ["url": url.absoluteString]
      )
    }
    return true
  }

  // MARK: - APNs → Firebase

  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    print("✅ APNs token received")
    Messaging.messaging().apnsToken = deviceToken
  }

  func messaging(
    _ messaging: Messaging,
    didReceiveRegistrationToken fcmToken: String?
  ) {
    print("✅ FCM TOKEN:", fcmToken ?? "nil")
  }

  // MARK: - PushKit (VoIP)

  func pushRegistry(
    _ registry: PKPushRegistry,
    didUpdate credentials: PKPushCredentials,
    for type: PKPushType
  ) {
    let token = credentials.token.map { String(format: "%02x", $0) }.joined()
    print("✅ VoIP Token:", token)

    RNVoipPushNotificationManager.didUpdate(
      credentials,
      forType: type.rawValue
    )
  }

  func pushRegistry(
    _ registry: PKPushRegistry,
    didInvalidatePushTokenFor type: PKPushType
  ) {
    print("⚠️ VoIP token invalidated")
  }

  func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {

    print("📞 VoIP payload received:", payload.dictionaryPayload)

    // 🔹 Send to React Native FIRST (for background processing)
    RNVoipPushNotificationManager.didReceiveIncomingPush(
      with: payload,
      forType: type.rawValue
    )

    let payloadData = payload.dictionaryPayload
    guard let dataDict = payloadData["data"] as? [String: Any],
          let callData = dataDict["data"] as? [String: Any] else {
      print("❌ Failed to extract call data from payload")
      completion()
      return
    }

    let uuid = payloadData["uuid"] as? String ?? UUID().uuidString
    let callerName = callData["sender_name"] as? String ?? "Unknown"
    let handle = callData["sender"] as? String ?? "Unknown"
    let callType = callData["call_type"] as? String ?? "video"
    let hasVideo = (callType == "video")

    print("📞 Displaying call from: \(callerName), Handle: \(handle), Video: \(hasVideo)")

    // 🔹 Show CallKit UI - but DON'T open app yet
    RNCallKeep.reportNewIncomingCall(
      uuid,
      handle: handle,
      handleType: "generic",
      hasVideo: hasVideo,
      localizedCallerName: callerName,
      supportsHolding: true,
      supportsDTMF: true,
      supportsGrouping: false,
      supportsUngrouping: false,
      fromPushKit: true,
      payload: payloadData as [AnyHashable : Any]?,
      withCompletionHandler: completion
    )

    // 🔹 REMOVED: Do NOT auto-notify React Native here
    // The notification will be sent ONLY when user taps Answer
  }

  // MARK: - React Native

  override func customize(_ rootView: RCTRootView!) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
        .jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
