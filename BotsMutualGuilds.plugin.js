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
    return '1.0.2';
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
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/nirewen/${this.getName()}/master/${this.getName()}.plugin.js`);
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

    $('.inner-1_1f7b')
      .find('.tab-bar-item')
      .eq(2)
      .remove();

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
              $(`<div class="listRow-1wEi-U weightMedium-13x9Y8">
                  ${this.getIconTemplate(guild)}
                  <div class="guild-inner">
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
}