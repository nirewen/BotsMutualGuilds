//META{"name":"BotsMutualGuilds"}*//

/* global $, Element, PluginUtilities, ReactUtilities */

class BotsMutualGuilds {
  getName() {
    return 'Bots Mutual Guilds';
  }

  getShortName() {
    return 'BMG';
  }

  getDescription() {
    return 'Brings back mutual servers to bot accounts';
  }

  getVersion() {
    return '1.0.3';
  }

  getAuthor() {
    return 'Nirewen';
  }
  
  load() {
    //
  }

  unload() {
    //
  }

  start() {
    const oldInstance = document.getElementById('zeresLibraryScript');

    if (oldInstance)
      oldInstance.parentElement.removeChild(oldInstance);

    const newInstance = document.createElement('script');
    newInstance.setAttribute('type', 'text/javascript');
    newInstance.setAttribute('src', 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js');
    newInstance.setAttribute('id', 'zeresLibraryScript');
    document.head.appendChild(newInstance);

    if (typeof window.ZeresLibrary !== 'undefined')
      this.initialize();
    else
      newInstance.addEventListener('load', () => this.initialize());
  }
  
  stop() {
    this.initialized = false;
  }

  initialize() {
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/nirewen/BotsMutualGuilds/master/BotsMutualGuilds.plugin.js`);
    PluginUtilities.showToast(`${this.getShortName()} ${this.getVersion()} has started.`);

    this.initialized = true;
    this.MembersStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getNick']);
  }

  switchToGuild(id) {
    $('.guilds-wrapper')
      .find('.guild-inner')
      .filter((i, guild) => $(guild).html().includes(id))
      .find('a')[0]
      .click();

    if (document.querySelector('.backdrop-2ohBEd'))
      $('.backdrop-2ohBEd').click();
    else
      $('.callout-backdrop').click();
  }

  getUser(guild, id) {
    return this.MembersStore.getMembers(guild.id).find(u => u.userId == id);
  }

  getIconTemplate(guild) {
    return guild.icon
      ? `<div class="avatar-large listAvatar-MpHQ5z" style="background-image: url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp)"></div>`
      : `<div class="avatar-large listAvatar-MpHQ5z" style="font-size: 16px;">${guild.acronym}</div>`;
  }

  observer(e) {
    if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized)
      return;

    const elem = e.addedNodes[0];
    
    if (!elem.querySelector('.botTag-1OwMgs') || !this.initialized)
        return;

    let oldGuilds;
    
    $('div[class*="topSection"').children('div').first().append(`<div class="tabBarContainer-3RVZc-"><div class="tab-bar tabBar-2z50ux TOP"><div class="tab-bar-item tabBarItem-1Lg555 selected">${this.locale.infos}</div><div class="tab-bar-item tabBarItem-1Lg555">${this.locale.guild}</div></div></div>`);

    const tabs = $('.inner-1_1f7b')
      .find('.tab-bar-item');

    const guilds = $('.inner-1_1f7b')
      .find('.scrollerWrap-2uBjct');

    tabs.eq(1)
      .on('click.bmg', (e) => {
        e.stopPropagation();

        const user = $('.inner-1_1f7b')
          .find('.avatar-1BXaQj .image-EVRGPw')
          .css('background-image')
          .split('/')[4];

        tabs.toggleClass('selected');

        oldGuilds = guilds.children();

        oldGuilds.parent().empty();
        
        guilds.append('<div class="scroller-fzNley listScroller-1M3aYe">');

        ReactUtilities.getOwnerInstance($('.guilds-wrapper')[0])
          .state.guilds.map(o => o.guild)
          .filter(guild => this.getUser(guild, user))
          .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
          .forEach((guild) => {
            guilds.find('.scroller-fzNley').append(
              $(`<div class="listRow-1wEi-U flex-3B1Tl4 weightMedium-13x9Y8">
                  ${this.getIconTemplate(guild)}
                  <div class="listRowContent-3pOfag">
                    <div class="listName-1Xr1Jk size16-3IvaX_ height16-1qXrGy">${guild.name}</div>
                    <div class="guildNick-1oZKE3 weightNormal-3gw0Lm">${this.getUser(guild, user).nick || ''}</div>
                  </div>
                </div>`).click(() => this.switchToGuild(guild.id))
            );
          });
      });

    tabs.eq(0)
      .on('click.bmg', () => {
        tabs.toggleClass('selected');

        guilds.empty();

        guilds.append(oldGuilds);
      });
  }
  
  get locale() {
    switch (document.documentElement.getAttribute('lang').split('-')[0]) {
      case 'en': // English
      case 'da': // Dansk
        return {
          'infos': 'User Info',
          'guild': 'Mutual Servers',
        };
      case 'hr': // Croatian
        return {
          'infos': 'Informacije o korisniku',
          'guild': 'Zajednički serveri',
        };
      case 'de': // Deutsch
        return {
          'infos': 'Benutzerinformationen',
          'guild': 'Gemeinsame Server',
        };
      case 'es': // Español
        return {
          'infos': 'Información de usuario', 
          'guild': 'Servidores en común',
        };
      case 'fr': // Français
        return {
          'infos': 'Infos utilisateur', 
          'guild': 'Serveurs en commun',
        };
      case 'it': // Italiano
        return {
          'infos': 'Dati personali', 
          'guild': 'Server in comune',
        };
      case 'nl': // Nederlands
        return {
          'infos': 'Gebruikersinformatie', 
          'guild': 'Gemeenschappelijke servers',
        };
      case 'no': // Norsk
        return {
          'infos': 'User Info', 
          'guild': 'Felles servere',
        };
      case 'pl': // Polski
        return {
          'infos': 'Informacje', 
          'guild': 'Wspólne serwery',
        };
      case 'pt': // Português do Brasil
        return {
          'infos': 'Informações do usuário', 
          'guild': 'Servidores em comum',
        };
      case 'fi': // Suomi
        return {
          'infos': 'Käyttäjätiedot', 
          'guild': 'Yhteiset palvelimet',
        };
      case 'sv': // Svenska
        return {
          'infos': 'Användarinfo', 
          'guild': 'Gemensamma servrar',
        };
      case 'tr': // Türkçe
        return {
          'infos': 'Kullanıcı Bilgisi', 
          'guild': 'Ortak Sunucular',
        };
      case 'cs': // Čeština
        return {
          'infos': 'Údaje uživatele', 
          'guild': 'Společné servery',
        };
      case 'bg': // български
        return {
          'infos': 'User Info', 
          'guild': 'Общи сървъри',
        };
      case 'ru': // Русский
        return {
          'infos': 'Профиль', 
          'guild': 'Общие сервера',
        };
      case 'uk': // Український
        return {
          'infos': 'User Info', 
          'guild': 'Спільні сервери',
        };
      case 'ja': // 日本語
        return {
          'infos': 'ユーザー情報', 
          'guild': '共通のサーバー',
        };
      case 'zh': // 繁體中文
        return {
          'infos': '使用者資訊', 
          'guild': '共同的伺服器',
        };
      case 'ko': // 한국어 
        return {
          'infos': '사용자 정보', 
          'guild': '같이 있는 서버',
        };
    }
  }
}