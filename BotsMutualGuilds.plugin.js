//META{"name":"BotsMutualGuilds"}*//

class BotsMutualGuilds {
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	getName         () { return "Bots Mutual Guilds"; }
	getShortName    () { return "BMG";                }
	getDescription  () { return 'Brings back mutual servers to bot accounts';}
	getVersion      () { return "1.0.0";              }
	getAuthor       () { return "Nirewen";            }
	stop            () { this.initialized = false;    }
	load            () {                              }
	unload          () {                              }
	
	initialize() {
		PluginUtilities.showToast(`${this.getShortName()} ${this.getVersion()} has started.`);
		this.initialized = true;
		this.MembersStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getNick']);
	}
	
	switchToGuild(id) {
		$(".guilds-wrapper").find('.guild-inner').filter((i, guild) => $(guild).html().includes(id)).find('a')[0].click();
		if (document.querySelector('.backdrop-2ohBEd')) 
			$('.backdrop-2ohBEd').click();
		else 
			$('.callout-backdrop').click();
	}
	
	getUser(guild, id) {
		return this.MembersStore.getMembers(guild.id).find(u => u.userId == id);
	}
	
	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;

		var elem = e.addedNodes[0];
		
		<!-- GAMBIARRA -->
		if ((elem.querySelector(".botTag-1OwMgs") || elem.querySelector(".bot-tag")) && this.initialized) {
			let self = this, oldGuilds;
			$('#user-profile-modal').find('.tab-bar-item').eq(2).remove();
			$('#user-profile-modal').find('.tab-bar-item').eq(1).on('click', e => {
				e.stopPropagation();
				let user = $('#user-profile-modal').find('.avatar-profile').css('background-image').split('/')[4];
				$('#user-profile-modal').find('.tab-bar-item').eq(0).toggleClass('selected');
				$('#user-profile-modal').find('.tab-bar-item').eq(1).toggleClass('selected');
				oldGuilds = $('#user-profile-modal').find('.guilds').children();
				oldGuilds.parent().empty();
				ReactUtilities.getOwnerInstance($(".guilds-wrapper")[0]).state.guilds.map(o => o.guild).filter(guild => {
					return self.getUser(guild, user);
				}).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
				.forEach(guild => {
					let icon = guild.icon ? `style="background-image: url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp)">` : `style="font-size: 16px;">${guild.acronym}`;
					$('#user-profile-modal').find('.guilds').append($(`<div class="guild"><div class="avatar-large" ${icon}</div><div class="guild-inner"><div class="guild-name">${guild.name}</div><div class="guild-nick">${self.getUser(guild, user).nick || ''}</div></div></div>`).click(() => self.switchToGuild(guild.id)));
				});
			});
			$('#user-profile-modal').find('.tab-bar-item').eq(0).on('click', e => {
				$('#user-profile-modal').find('.tab-bar-item').eq(1).toggleClass('selected');
				$('#user-profile-modal').find('.tab-bar-item').eq(0).toggleClass('selected');
				$('#user-profile-modal').find('.guilds').empty();
				$('#user-profile-modal').find('.guilds').append(oldGuilds);
			});
		}
	}
}