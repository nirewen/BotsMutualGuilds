//META{"name":"BotsMutualGuilds"}*//

class BotsMutualGuilds {
  start() {
    const oldInstance = document.getElementById('zeresLibraryScript');

    if (oldInstance) {
      oldInstance.parentElement.removeChild(oldInstance);
    }

    const newInstance = document.createElement('script');
    newInstance.setAttribute('type', 'text/javascript');
    newInstance.setAttribute('src', 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js');
    newInstance.setAttribute('id', 'zeresLibraryScript');
    document.head.appendChild(newInstance);

    if (typeof window.ZeresLibrary !== 'undefined') {
      this.initialize();
    } else {
      newInstance.addEventListener('load', () => this.initialize());
    }
  }

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
    return '1.0.0';
  }

  getAuthor() {
    return 'Nirewen';
  }

  stop() {
    this.initialized = false;
  }

  load() {
  	//
  }

  unload() {
  	//
  }

  initialize() {
    PluginUtilities.showToast(`${this.getShortName()} ${this.getVersion()} has started.`);

    this.initialized = true;
    this.MembersStore = PluginUtilities.WebpackModules.findByUniqueProperties([
      'getNick',
    ]);
  }

  switchToGuild(id) {
    $('.guilds-wrapper')
      .find('.guild-inner')
      .filter((i, guild) => $(guild).html().includes(id))
      .find('a')[0]
      .click();

    if (document.querySelector('.backdrop-2ohBEd')) {
      $('.backdrop-2ohBEd').click();
    } else {
    	 $('.callout-backdrop').click();
    }
  }

  getUser(guild, id) {
    return this.MembersStore.getMembers(guild.id).find(u => u.userId == id);
  }

  getIcon (guild) {
    if (guild.icon) {
      return `style="background-image: url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp)">`;
    }

    return `style="font-size: 16px;">${guild.acronym}`;
  }

  invalid (e) {
  	return ! e.addedNodes.length || ! (e.addedNodes[0] instanceof Element) || ! this.initialized;
  }

  observer(e) {
    if (this.invalid(e)) {
      return;
    }

    const elem = e.addedNodes[0];

    // GAMBIARRA
    if (! (elem.querySelector('.botTag-1OwMgs') || elem.querySelector('.bot-tag')) || ! this.initialized) {
    	return;
    }

    let oldGuilds;

    $('#user-profile-modal')
      .find('.tab-bar-item')
      .eq(2)
      .remove();

    const tabs = $('#user-profile-modal')
      .find('.tab-bar-item');

    const guilds = $('#user-profile-modal')
    	.find('.guilds')

    tabs.eq(1)
      .on('click', (e) => {
        e.stopPropagation();

        const user = $('#user-profile-modal')
          .find('.avatar-profile')
          .css('background-image')
          .split('/')[4];

        tabs.eq(0)
          .toggleClass('selected');

        tabs.eq(1)
          .toggleClass('selected');

        oldGuilds = guilds.children();

        oldGuilds.parent().empty();

        ReactUtilities.getOwnerInstance($('.guilds-wrapper')[0])
          .state.guilds.map(o => o.guild)
          .filter(guild => this.getUser(guild, user))
          .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
          .forEach((guild) => {
            const icon = this.getIcon(guild);

            guilds.append(
              $(`
                <div class="guild">
                  <div class="avatar-large">${icon}</div>
                  <div class="guild-inner">
                    <div class="guild-name">${guild.name}</div>
                    <div class="guild-nick">${this.getUser(guild, user).nick || ''}</div>
                  </div>
                </div>
              ` ).click(() => this.switchToGuild(guild.id))
            );
          });
      });

    tabs.eq(0)
      .on('click', () => {
      	tabs.eq(1)
          .toggleClass('selected');

        tabs.eq(0)
          .toggleClass('selected');

        guilds.empty();

        guilds.append(oldGuilds);
      });
  }
}
