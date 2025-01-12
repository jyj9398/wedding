
class UserAgent {
  constructor(ua) {
      
      this.ua = (ua || window.navigator.userAgent).toString().toLowerCase();
      this.checkOs(this.ua);
      
      return {
          ua: this.ua,
          browser: this.checkUserAgent(this.ua),
          platform: this.checkPlatform(this.ua),
          os: this.checkOs(this.ua),
          app: this.checkApp(this.ua)
      };
  }
  
  checkUserAgent(ua) {
      const browser = {};
      var match = /(dolfin)[ \/]([\w.]+)/.exec(ua) || /(edge)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(webkit)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || ["", "unknown"];
      
      if (match[1] === "webkit") {
          match = /(iphone|ipad|ipod)[\S\s]*os ([\w._\-]+) like/.exec(ua) || /(android)[ \/]([\w._\-]+);/.exec(ua) || [match[0], "safari", match[2]];
      } else if (match[1] === "mozilla") {
          if (/trident/.test(ua)) {
              match[1] = "msie";
          } else {
              match[1] = "firefox";
          }
      } else if (match[1] === "edge") {
          match[1] = "spartan";
      } else if (/polaris|natebrowser|([010|011|016|017|018|019]{3}\d{3,4}\d{4}$)/.test(ua)) {
          match[1] = "polaris";
      }
      
      browser[match[1]] = true;
      browser.name = match[1];
      
      browser.version = this.setVersion(match[2]);
      
      return browser;
  }
  
  isPc(ua) {
      if (ua.match(/linux|windows (nt|98)|macintosh/) && !ua.match(/android|mobile|polaris|lgtelecom|uzard|natebrowser|ktf;|skt;/)) {
          return true;
      }
      return false;
  }
  
  isTablet(ua) {
      if (ua.match(/ipad/) || ua.match(/android/) && !ua.match(/mobi|mini|fennec/)) {
          return true;
      }
      return false;
  }
  
  isMobile(ua) {
      if (!!ua.match(/ip(hone|od)|android.+mobile|windows (ce|phone)|blackberry|bb10|symbian|webos|firefox.+fennec|opera m(ob|in)i|polaris|iemobile|lgtelecom|nokia|sonyericsson|dolfin|uzard|natebrowser|ktf;|skt;/)) {
          return true;
      } else {
          return false;
      }
  }
  setVersion(versionString) {
      const version = {};

      const versions = versionString ? versionString.split(/\.|-|_/) : ["0", "0", "0"];
      version.info = versions.join(".");
      version.major = versions[0] || "0";
      version.minor = versions[1] || "0";
      version.patch = versions[2] || "0";

      return version;
  }
  
  checkPlatform(ua) {
      if (this.isPc(ua)) {
          return "pc";
      } else if (this.isTablet(ua)) {
          return "tablet";
      } else if (this.isMobile(ua)) {
          return "mobile";
      } else {
          return "";
      }
  }
  
  checkOs(ua) {
      const os = {},
          match = /(iphone|ipad|ipod)[\S\s]*os ([\w._\-]+) like/.exec(ua) || /(android)[ \/]([\w._\-]+);/.exec(ua) || (/android/.test(ua) ? ["", "android", "0.0.0"] : false) || (/polaris|natebrowser|([010|011|016|017|018|019]{3}\d{3,4}\d{4}$)/.test(ua) ? ["", "polaris", "0.0.0"] : false) || /(windows)(?: nt | phone(?: os){0,1} | )([\w._\-]+)/.exec(ua) || (/(windows)/.test(ua) ? ["", "windows", "0.0.0"] : false) || /(mac) os x ([\w._\-]+)/.exec(ua) || (/(linux)/.test(ua) ? ["", "linux", "0.0.0"] : false) || (/webos/.test(ua) ? ["", "webos", "0.0.0"] : false) || /(bada)[ \/]([\w._\-]+)/.exec(ua) || (/bada/.test(ua) ? ["", "bada", "0.0.0"] : false) || (/(rim|blackberry|bb10)/.test(ua) ? ["", "blackberry", "0.0.0"] : false) || ["", "unknown", "0.0.0"];

      if (match[1] === "iphone" || match[1] === "ipad" || match[1] === "ipod") {
          match[1] = "ios";
      } else if (match[1] === "windows" && match[2] === "98") {
          match[2] = "0.98.0";
      }
      os[match[1]] = true;
      os.name = match[1];
      os.version = this.setVersion(match[2]);
      return os;
  }
  
  checkApp(ua) {
      const app = {},
          match = /(crios)[ \/]([\w.]+)/.exec(ua) || /(daumapps)[ \/]([\w.]+)/.exec(ua) || ["", ""];

      if (match[1]) {
          app.isApp = true;
          app.name = match[1];
          app.version = this.setVersion(match[2]);
      } else {
          app.isApp = false;
      }

      return app;
  }
}

class CallWeb2App {
  
  constructor(setting) {
      
      this.settings = {
          scheme: '',
          useUrlScheme: '',
          fallbackUrl: '',
          fail: ''
      }
      this.settings = {...this.settings, ...setting};
      this.TIMEOUT_IOS = 2 * 1000;
      this.TIMEOUT_ANDROID = 3 * 100;
      this.INTERVAL = 100;
      this.UA = this.browserProxy().getUA();
      this.os = this.UA.os;
      this.ua = this.UA;
      
      this.intentNotSupportedBrowserList = ['firefox', 'opr/'];
      this.intentSupportCustomBrowserList = ['KAKAOTALK'];
  }
  
  browserProxy() {
      return {
          getOrigin: function getOrigin() {
              const _location = location,
                  protocol = _location.protocol,
                  hostname = _location.hostname,
                  port = _location.port;
      
              return protocol + "//" + hostname + (port ? ':' + port : '');
          },
          getNavigator: function getNavigator() {
              return navigator;
          },
          getUA: function getUA() {
              return new UserAgent();
          }
      }
  }
  
  
  callWeb2app (scheme, fallbackUrl) {
      const androidIntent = this.settings.package ? ["intent:" + scheme + "#Intent", "package="+this.settings.package, "S.browser_fallback_url=" + encodeURIComponent(fallbackUrl), 'end;'].join(';') : "";
      var web2appOptions = {
          urlScheme: scheme,
          intentURI: androidIntent,
          storeURL: fallbackUrl,
          useUrlScheme: this.settings.useUrlScheme,
          universalLink: this.settings.universalLink,
          onAppMissing: this.settings.onAppMissing,
          onUnsupportedEnvironment: this.settings.fail
      };
      try {
          this.web2app(web2appOptions);
      } catch (error) {
          console.log('error', error);
      }
  }
  
  web2app(context) {
      const os = this.os;
      const willInvokeApp = typeof context.willInvokeApp === 'function' ? context.willInvokeApp : function () {},
          onAppMissing = typeof context.onAppMissing === 'function' ? context.onAppMissing : this.moveToStore,
          onUnsupportedEnvironment = typeof context.onUnsupportedEnvironment === 'function' ? context.onUnsupportedEnvironment : function () {};

      willInvokeApp();
      os.ios = true;
      if (os.android) {
          if (this.isIntentSupportedBrowser() && context.intentURI && !context.useUrlScheme) {
              this.web2appViaIntentURI(context.intentURI);
          } else if (context.storeURL) {
              this.web2appViaCustomUrlSchemeForAndroid(context.urlScheme, context.storeURL, onAppMissing);
          }
      } else if (os.ios && context.storeURL) {
          this.web2appViaCustomUrlSchemeForIOS(context.urlScheme, context.storeURL, onAppMissing, context.universalLink);
      } else {
          setTimeout(function () {
              onUnsupportedEnvironment();
          }, 100);
      }
  }
  
  isIntentSupportedBrowser() {
      
      const ua = this.ua;
      var supportsIntent = ua.browser.chrome && +ua.browser.version.major >= 25;
      var blackListRegexp = new RegExp(this.intentNotSupportedBrowserList.join('|'), "i");
      var whiteListRegexp = new RegExp(this.intentSupportCustomBrowserList.join('|'), "i");
      return supportsIntent && !blackListRegexp.test(ua.ua) || whiteListRegexp.test(ua.ua);
  }
  
  web2appViaIntentURI(launchURI) {
      const ua = this.ua;
      if (ua.browser.chrome) {
          move();
      } else {
          setTimeout(move, 100);
      }

      function move() {
          top.location.href = launchURI;
      }
  }
  
  web2appViaCustomUrlSchemeForAndroid(urlScheme, storeURL, fallback) {
      this.deferFallback(this.TIMEOUT_ANDROID, storeURL, fallback);
      this.launchAppViaHiddenIframe(urlScheme);
  }
  
  web2appViaCustomUrlSchemeForIOS(urlScheme, storeURL, fallback, universalLink) {
      const tid = this.deferFallback(this.TIMEOUT_IOS, storeURL, fallback);
      const ua = this.ua;
      if (parseInt(ua.os.version.major, 10) < 8) {
          this.bindPagehideEvent(tid);
      } else {
          this.bindVisibilityChangeEvent(tid);
      }
      
      if (this.isSupportUniversalLinks()) {
          if (universalLink === undefined) {
              universalLink = urlScheme;
          } else {
          }
          this.launchAppViaChangingLocation(universalLink);
      } else {
          this.launchAppViaHiddenIframe(urlScheme);
      }
  }
  
  isPageVisible() {
      const attrNames = ['hidden', 'webkitHidden'];
      for (var i = 0, len = attrNames.length; i < len; i++) {
          if (typeof document[attrNames[i]] !== 'undefined') {
              return !document[attrNames[i]];
          }
      }
      return true;
  }
  
  deferFallback(timeout, storeURL, fallback) {
      const clickedAt = new Date().getTime();
      const $this = this;
      return setTimeout(function () {
          var now = new Date().getTime();
          if ($this.isPageVisible() && now - clickedAt < timeout + $this.INTERVAL) {
              fallback(storeURL);
          }
      }, timeout);
  }
  
  createHiddenIframe(id) {
      const iframe = document.createElement('iframe');
      iframe.id = id;
      iframe.style.border = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.display = 'none';
      iframe.style.overflow = 'hidden';
      document.body.appendChild(iframe);
      return iframe;
  }
  
  launchAppViaHiddenIframe(urlScheme) {
      const $this = this;
      setTimeout(function () {
          const iframe = $this.createHiddenIframe('appLauncher');
          iframe.src = urlScheme;
      }, 100);
  }
  
  bindPagehideEvent(tid) {
      const $this = this;
      window.addEventListener('pagehide', function clear() {
          if ($this.isPageVisible()) {
              clearTimeout(tid);
              window.removeEventListener('pagehide', clear);
          }
      });
  }
  
  bindVisibilityChangeEvent(tid) {
      const $this = this;
      document.addEventListener('visibilitychange', function clear() {
          if ($this.isPageVisible()) {
              clearTimeout(tid);
              document.removeEventListener('visibilitychange', clear);
          }
      });
  }
  
  isSupportUniversalLinks() {
      const ua = this.ua;
      return parseInt(ua.os.version.major, 10) > 8 && ua.os.ios;
  }
  
  launchAppViaChangingLocation(urlScheme) {
      window.top.location.replace(urlScheme);
  }
  
  launchAppViaHiddenIframe(urlScheme) {
      const $this = this;
      setTimeout(function () {
          const iframe = $this.createHiddenIframe('appLauncher');
          iframe.src = urlScheme;
      }, 100);
  }
  
  moveToStore(storeURL) {
      window.top.location.replace(storeURL);
  }
  
  run() {
      this.callWeb2app(this.settings.scheme, this.settings.fallbackUrl);        
  }
  
}


function fnCallWeb2App(type) {
  event.preventDefault();
  var scheme, package, fallbackUrl, fail, useUrlScheme;
  const lat = 127.1036;
  const long = 37.5152;
  const lang = 'ko';
  const msg = lang === 'ko' ? '앱이 설치되어 있지 않은 경우\n길 안내가 실행되지 않을 수 있습니다' : 'If the app is not installed, directions may not start.'
  const kakao_name = '더베네치아';
  const naver_name = '더베네치아웨딩부페';
  const tmap_name = '더베네치아';
  

  switch(type) {
      case 'kakaoNavi':
          alert(msg);
          // window.open(`https://map.kakao.com/link/to/${kakao_name},${mp_y},${mp_x}`,'kakaomap','');
          Kakao.Navi.share({
              name: kakao_name,
              x: lat,
              y: long,
              coordType: 'wgs84'
          });
          break;
      case 'tmap':
        alert(msg);
          scheme = `tmap://route?goalx=${lat}&goaly=${long}&goalname=${tmap_name}`;
          package = 'com.skt.tmap.ku';
          fallbackUrl = scheme;
          break;
      case 'naverMap':
        alert(msg);
          scheme = `navermaps://?menu=location&pinType=place&lat=${long}&lng=${lat}&title=${naver_name}`;
          package = 'com.nhn.android.nmap';
          //useUrlScheme = true;
          fallbackUrl = `http://map.naver.com/index.nhn?elng=${lat}&elat=${long}&etext=${naver_name}&menu=route&pathType=0`;
          fail = function() {
              $('#fakeAnchor').remove();
              $('body').append(`<a href='http://map.naver.com/index.nhn?elng=${lat}&elat=${long}&etext=${naver_name}&menu=route&pathType=0' id='fakeAnchor'></a>`);
              $('#fakeAnchor').get(0).click();
          }
          break;

  }

  const callWeb2App = new CallWeb2App({
      scheme: scheme,
      package: package,
      useUrlScheme: useUrlScheme,
      fallbackUrl: fallbackUrl,
      fail: fail
  });

  callWeb2App.run();
}
