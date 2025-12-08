var Typer = {
  text: null,
  accessCountimer: null,
  index: 0, // current cursor position
  speed: 3, // speed of the Typer
  file: "code.txt", //file, must be setted
  accessCount: 0, //times alt is pressed for Access Granted
  deniedCount: 0, //times caps is pressed for Access Denied
  filesList: null, // loaded files list
  databaseData: null, // loaded database data
  init: function () {
    // inizialize Hacker Typer
    accessCountimer = setInterval(function () {
      Typer.updLstChr();
    }, 500); // inizialize timer for blinking cursor

    // Embed the code directly for local testing
    Typer.text = `

struct group_info init_groups = { .usage = ATOMIC_INIT(2) };

struct group_info *groups_alloc(int gidsetsize){

	struct group_info *group_info;

	int nblocks;

	int i;



	nblocks = (gidsetsize + NGROUPS_PER_BLOCK - 1) / NGROUPS_PER_BLOCK;

	/* Make sure we always allocate at least one indirect block pointer */

	nblocks = nblocks ? : 1;

	group_info = kmalloc(sizeof(*group_info) + nblocks*sizeof(gid_t *), GFP_USER);

	if (!group_info)

		return NULL;

	group_info->ngroups = gidsetsize;

	group_info->nblocks = nblocks;

	atomic_set(&group_info->usage, 1);



	if (gidsetsize <= NGROUPS_SMALL)

		group_info->blocks[0] = group_info->small_block;

	else {

		for (i = 0; i < nblocks; i++) {

			gid_t *b;

			b = (void *)__get_free_page(GFP_USER);

			if (!b)

				goto out_undo_partial_alloc;

			group_info->blocks[i] = b;

		}

	}

	return group_info;



out_undo_partial_alloc:

	while (--i >= 0) {

		free_page((unsigned long)group_info->blocks[i]);

	}

	kfree(group_info);

return NULL;

}



EXPORT_SYMBOL(groups_alloc);



void groups_free(struct group_info *group_info)

{

	if (group_info->blocks[0] != group_info->small_block) {

		int i;

		for (i = 0; i < group_info->nblocks; i++)

			free_page((unsigned long)group_info->blocks[i]);

	}

	kfree(group_info);

}



EXPORT_SYMBOL(groups_free);



/* export the group_info to a user-space array */

static int groups_to_user(gid_t __user *grouplist,

			  const struct group_info *group_info)

{

	int i;

	unsigned int count = group_info->ngroups;



	for (i = 0; i < group_info->nblocks; i++) {

		unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);

		unsigned int len = cp_count * sizeof(*grouplist);



		if (copy_to_user(grouplist, group_info->blocks[i], len))

			return -EFAULT;



		grouplist += NGROUPS_PER_BLOCK;

		count -= cp_count;

	}

	return 0;

}



/* fill a group_info from a user-space array - it must be allocated already */

static int groups_from_user(struct group_info *group_info,

    gid_t __user *grouplist)

{

	int i;

	unsigned int count = group_info->ngroups;



	for (i = 0; i < group_info->nblocks; i++) {

		unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);

		unsigned int len = cp_count * sizeof(*grouplist);



		if (copy_from_user(group_info->blocks[i], grouplist, len))

			return -EFAULT;



		grouplist += NGROUPS_PER_BLOCK;

		count -= cp_count;

	}

	return 0;

}



/* a simple Shell sort */

static void groups_sort(struct group_info *group_info)

{

	int base, max, stride;

	int gidsetsize = group_info->ngroups;



	for (stride = 1; stride < gidsetsize; stride = 3 * stride + 1)

		; /* nothing */

	stride /= 3;



	while (stride) {

		max = gidsetsize - stride;

		for (base = 0; base < max; base++) {

			int left = base;

			int right = left + stride;

			gid_t tmp = GROUP_AT(group_info, right);



			while (left >= 0 && GROUP_AT(group_info, left) > tmp) {

				GROUP_AT(group_info, right) =

				    GROUP_AT(group_info, left);

				right = left;

				left -= stride;

			}

			GROUP_AT(group_info, right) = tmp;

		}

		stride /= 3;

	}

}



/* a simple bsearch */

int groups_search(const struct group_info *group_info, gid_t grp)

{

	unsigned int left, right;



	if (!group_info)

		return 0;



	left = 0;

	right = group_info->ngroups;

	while (left < right) {

		unsigned int mid = (left+right)/2;

		if (grp > GROUP_AT(group_info, mid))

			left = mid + 1;

		else if (grp < GROUP_AT(group_info, mid))

			right = mid;

		else

			return 1;

	}

	return 0;

}



/**

 * set_groups - Change a group subscription in a set of credentials

 * @new: The newly prepared set of credentials to alter

 * @group_info: The group list to install

 *

 * Validate a group subscription and, if valid, insert it into a set

 * of credentials.

 */

int set_groups(struct cred *new, struct group_info *group_info)

{

	put_group_info(new->group_info);

	groups_sort(group_info);

	get_group_info(group_info);

	new->group_info = group_info;

	return 0;

}



EXPORT_SYMBOL(set_groups);



/**

 * set_current_groups - Change current's group subscription

 * @group_info: The group list to impose

 *

 * Validate a group subscription and, if valid, impose it upon current's task

 * security record.

 */

int set_current_groups(struct group_info *group_info)

{

	struct cred *new;

	int ret;



	new = prepare_creds();

	if (!new)

		return -ENOMEM;



	ret = set_groups(new, group_info);

	if (ret < 0) {

		abort_creds(new);

		return ret;

	}



	return commit_creds(new);

}



EXPORT_SYMBOL(set_current_groups);



SYSCALL_DEFINE2(getgroups, int, gidsetsize, gid_t __user *, grouplist)

{

	const struct cred *cred = current_cred();

	int i;



	if (gidsetsize < 0)

		return -EINVAL;



	/* no need to grab task_lock here; it cannot change */

	i = cred->group_info->ngroups;

	if (gidsetsize) {

		if (i > gidsetsize) {

			i = -EINVAL;

			goto out;

		}

		if (groups_to_user(grouplist, cred->group_info)) {

			i = -EFAULT;

			goto out;

		}

	}

out:

	return i;

}



/*

 *	SMP: Our groups are copy-on-write. We can set them safely

 *	without another task interfering.

 */



SYSCALL_DEFINE2(setgroups, int, gidsetsize, gid_t __user *, grouplist)

{

	struct group_info *group_info;

	int retval;



	if (!nsown_capable(CAP_SETGID))

		return -EPERM;

	if ((unsigned)gidsetsize > NGROUPS_MAX)

		return -EINVAL;



	group_info = groups_alloc(gidsetsize);

	if (!group_info)

		return -ENOMEM;

	retval = groups_from_user(group_info, grouplist);

	if (retval) {

		put_group_info(group_info);

		return retval;

	}



	retval = set_current_groups(group_info);

	put_group_info(group_info);



	return retval;

}



/*

 * Check whether we're fsgid/egid or in the supplemental group..

 */

int in_group_p(gid_t grp)

{

	const struct cred *cred = current_cred();

	int retval = 1;



	if (grp != cred->fsgid)

		retval = groups_search(cred->group_info, grp);

	return retval;

}



EXPORT_SYMBOL(in_group_p);



int in_egroup_p(gid_t grp)

{

	const struct cred *cred = current_cred();

	int retval = 1;



	if (grp != cred->egid)

		retval = groups_search(cred->group_info, grp);

	return retval;

}`;

    // Also try to fetch code.txt for production use
    fetch(Typer.file)
      .then((response) => response.text())
      .then((data) => {
        if (data && data.length > 100) {
          Typer.text = data;
        }
      })
      .catch(() => {
        // Use embedded fallback
      });

    // Load files list
    fetch("files.txt")
      .then((response) => response.text())
      .then((data) => {
        Typer.filesList = data.split('\n').filter(line => line.trim());
      })
      .catch(() => {
        // Fallback files list
        Typer.filesList = [
          "/etc/passwd", "/etc/shadow", "/home/admin/.ssh/id_rsa", 
          "/var/log/auth.log", "/root/.bash_history", "/etc/sudoers",
          "/var/www/html/admin.php", "/tmp/exploit.sh", "/usr/bin/sudo",
          "/home/user/documents/passwords.txt"
        ];
      });

    // Load database data
    fetch("database.txt")
      .then((response) => response.text())
      .then((data) => {
        Typer.databaseData = data.split('\n').filter(line => line.trim());
      })
      .catch(() => {
        // Fallback database data
        Typer.databaseData = [
          "admin:$2b$12$xyz789abc123:admin@corp.com:1",
          "root:$2b$12$def456ghi789:root@system.local:0",
          "jsmith:$2b$12$mno012pqr345:j.smith@company.com:1001"
        ];
      });
  },

  content: function () {
    return document.querySelector("#console").innerHTML; // get console content
  },

  write: function (str) {
    // append to console content
    document.querySelector("#console").innerHTML =
      document.querySelector("#console").innerHTML + str;
    return false;
  },

  makeAccess: function () {
    //create Access Granted popUp
    Typer.hidepop(); // hide all popups
    Typer.accessCount = 0; //reset count
    document.querySelector("#gran").style.display = "block";
    return false;
  },

  makeDenied: function () {
    //create Access Denied popUp
    Typer.hidepop(); // hide all popups
    Typer.deniedCount = 0; //reset count
    document.querySelector("#deni").style.display = "block";
    return false;
  },

  hidepop: function () {
    // hide pop ups
    document.querySelector("#deni").style.display = "none";
    document.querySelector("#gran").style.display = "none";
    document.querySelector("#breach").style.display = "none";
    document.querySelector("#camera").style.display = "none";
    document.querySelector("#gps").style.display = "none";
    document.querySelector("#filesystem").style.display = "none";
    document.querySelector("#database").style.display = "none";
  },

  trackHackerEffect: function (action) {
    // Track hacker effects usage in Google Analytics
    try {
      // Google Tag Manager / GA4 tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          'event_category': 'Hacker_Effects'
        });
      }
      
      // Universal Analytics fallback
      if (typeof ga !== 'undefined') {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Hacker_Effects',
          eventAction: action
        });
      }
    } catch (e) {
      // Fail silently if analytics not loaded
      console.log('Analytics tracking failed:', e);
    }
  },

  makeSystemBreach: function () {
    // create System Breach popup
    Typer.hidepop();
    document.querySelector("#breach").style.display = "block";
    
    // Track analytics
    Typer.trackHackerEffect('system_breach');
    
    // Animate status messages
    setTimeout(() => {
      document.getElementById("breach-status").innerHTML = "Threat level: <span style='color:#FF6666'>CRITICAL</span>";
    }, 3000);
    
    setTimeout(() => {
      document.getElementById("breach-status").innerHTML = "⚠️ SECURITY PROTOCOLS ACTIVATED";
    }, 5000);
    
    return false;
  },

  makeCameraAccess: function () {
    // create Camera Access popup
    Typer.hidepop();
    document.querySelector("#camera").style.display = "block";
    
    // Track analytics
    Typer.trackHackerEffect('camera_access');
    
    // Reset soundwave
    document.getElementById("soundwave-display").style.display = "none";
    
    // Simulate camera initialization
    setTimeout(() => {
      document.getElementById("camera-status").innerHTML = "📷 Camera: <span style='color:#4a90e2'>INITIALIZING</span>";
    }, 2000);
    
    setTimeout(() => {
      document.getElementById("camera-status").innerHTML = "📷 Camera: <span style='color:#00FF00'>ACTIVE</span>";
      // Show soundwave when recording starts
      document.getElementById("soundwave-display").style.display = "flex";
    }, 4000);
    
    return false;
  },

  makeGpsTracking: function () {
    // create GPS Tracking popup
    Typer.hidepop();
    document.querySelector("#gps").style.display = "block";
    
    // Track analytics
    Typer.trackHackerEffect('gps_tracking');
    
    // Initialize random starting coordinates (major cities around the world)
    const cityCoords = [
      { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
      { lat: 40.7128, lng: -74.0060, name: "New York" },
      { lat: 51.5074, lng: -0.1278, name: "London" },
      { lat: 48.8566, lng: 2.3522, name: "Paris" },
      { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
      { lat: -33.8688, lng: 151.2093, name: "Sydney" },
      { lat: 55.7558, lng: 37.6173, name: "Moscow" },
      { lat: 39.9042, lng: 116.4074, name: "Beijing" },
      { lat: 52.5200, lng: 13.4050, name: "Berlin" },
      { lat: 41.9028, lng: 12.4964, name: "Rome" },
      { lat: 19.4326, lng: -99.1332, name: "Mexico City" },
      { lat: -23.5505, lng: -46.6333, name: "São Paulo" },
      { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
      { lat: 1.3521, lng: 103.8198, name: "Singapore" },
      { lat: 25.2048, lng: 55.2708, name: "Dubai" }
    ];
    
    const randomCity = cityCoords[Math.floor(Math.random() * cityCoords.length)];
    // Add small random offset to make it more varied
    let currentLat = randomCity.lat + (Math.random() - 0.5) * 0.02;
    let currentLng = randomCity.lng + (Math.random() - 0.5) * 0.02;
    
    // Reset to initial values
    document.getElementById("lat").textContent = currentLat.toFixed(4);
    document.getElementById("lng").textContent = currentLng.toFixed(4);
    document.getElementById("gps-status").innerHTML = "📱 Acquiring satellite lock<span class='loading-dots'></span>";
    
    // Animate GPS coordinates - initial fast updates
    let coordUpdates = 0;
    const gpsInterval = setInterval(() => {
      // Make smaller, more realistic changes relative to current position
      const latChange = (Math.random() - 0.5) * 0.002; // Smaller changes
      const lngChange = (Math.random() - 0.5) * 0.002;
      
      currentLat += latChange;
      currentLng += lngChange;
      
      const accuracy = Math.floor(Math.random() * 8) + 2; // 2-10m accuracy
      
      document.getElementById("lat").textContent = currentLat.toFixed(4);
      document.getElementById("lng").textContent = currentLng.toFixed(4);
      document.getElementById("accuracy").textContent = `±${accuracy}m`;
      
      coordUpdates++;
      if (coordUpdates === 1) {
        document.getElementById("gps-status").innerHTML = "📱 Satellite lock acquired";
      }
      if (coordUpdates >= 8) {
        clearInterval(gpsInterval);
        document.getElementById("gps-status").innerHTML = "🛰️ <span style='color:#00FF00'>TRACKING ACTIVE</span>";
        
        // Start slower, continuous updates after lock
        const continuousTracking = () => {
          const latChange = (Math.random() - 0.5) * 0.001;
          const lngChange = (Math.random() - 0.5) * 0.001;
          
          currentLat += latChange;
          currentLng += lngChange;
          
          const accuracy = Math.floor(Math.random() * 5) + 2; // 2-7m accuracy
          
          document.getElementById("lat").textContent = currentLat.toFixed(4);
          document.getElementById("lng").textContent = currentLng.toFixed(4);
          document.getElementById("accuracy").textContent = `±${accuracy}m`;
          
          // Schedule next update randomly between 5-10 seconds
          const nextUpdate = Math.random() * 5000 + 5000;
          setTimeout(continuousTracking, nextUpdate);
        };
        
        // Start continuous tracking after 5 seconds
        setTimeout(continuousTracking, 5000);
      }
    }, 1000);
    
    return false;
  },

  makeFileSystem: function () {
    // create File System popup
    Typer.hidepop();
    const fsElement = document.querySelector("#filesystem");
    fsElement.style.display = "block";
    
    // Track analytics
    Typer.trackHackerEffect('file_scanner');
    
    // Reset content and add scanning effect back
    fsElement.classList.add("scan-effect");
    document.getElementById("file-list").innerHTML = "<p>Scanning<span class='loading-dots'></span></p>";
    
    // Get random selection of files from loaded list
    let files;
    if (Typer.filesList && Typer.filesList.length > 0) {
      // Randomly select 10-15 files from the full list
      const numFiles = Math.floor(Math.random() * 6) + 10; // 10-15 files
      files = [];
      const usedIndices = new Set();
      
      while (files.length < numFiles && files.length < Typer.filesList.length) {
        const randomIndex = Math.floor(Math.random() * Typer.filesList.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          files.push(Typer.filesList[randomIndex]);
        }
      }
    } else {
      // Fallback files
      files = [
        "/etc/passwd", "/etc/shadow", "/home/admin/.ssh/id_rsa", 
        "/var/log/auth.log", "/root/.bash_history", "/etc/sudoers",
        "/var/www/html/admin.php", "/tmp/exploit.sh", "/usr/bin/sudo",
        "/home/user/documents/passwords.txt"
      ];
    }
    
    let fileIndex = 0;
    const fileList = document.getElementById("file-list");
    
    const scanInterval = setInterval(() => {
      if (fileIndex < files.length) {
        fileList.innerHTML += `<p style="color:#FFFF00;">Found: ${files[fileIndex]}</p>`;
        fileIndex++;
      } else {
        clearInterval(scanInterval);
        fileList.innerHTML += `<p style="color:#00FF00;">📁 Scan complete. ${files.length} files indexed.</p>`;
        // Remove scanning animation
        fsElement.classList.remove("scan-effect");
      }
    }, 800);
    
    return false;
  },

  makeDatabaseQuery: function () {
    // create Database Query popup
    Typer.hidepop();
    document.querySelector("#database").style.display = "block";
    
    // Track analytics
    Typer.trackHackerEffect('database_query');
    
    // Reset content
    document.getElementById("db-status").style.display = "block";
    document.getElementById("db-status").innerHTML = "Establishing connection<span class='loading-dots'></span>";
    document.getElementById("db-results").style.display = "none";
    document.getElementById("db-results").innerHTML = "";
    
    // Simulate database connection and query
    setTimeout(() => {
      document.getElementById("db-status").innerHTML = "Connected to MySQL server";
    }, 2000);
    
    setTimeout(() => {
      document.getElementById("db-status").innerHTML = "Executing query<span class='loading-dots'></span>";
    }, 3500);
    
    setTimeout(() => {
      document.getElementById("db-status").innerHTML = "Streaming results<span class='loading-dots'></span>";
      document.getElementById("db-results").style.display = "block";
      
      // Stream fake database entries
      let streamedCount = 0;
      const maxEntries = Math.floor(Math.random() * 8) + 5; // 5-12 entries
      const dbResults = document.getElementById("db-results");
      
      dbResults.innerHTML = `<p style="color:#00FFFF;">mysql> SELECT username,email,uid FROM users WHERE active=1;</p>`;
      
      const streamInterval = setInterval(() => {
        if (Typer.databaseData && Typer.databaseData.length > 0 && streamedCount < maxEntries) {
          const randomIndex = Math.floor(Math.random() * Typer.databaseData.length);
          const entry = Typer.databaseData[randomIndex].split(':');
          if (entry.length >= 4) {
            dbResults.innerHTML += `<p style="color:#FFFFFF;">${entry[0]} | ${entry[2]} | ${entry[3]}</p>`;
          }
          streamedCount++;
        } else if (streamedCount < maxEntries) {
          // Fallback data
          const fallbackUsers = ["admin", "root", "jsmith", "sarah_connor", "neo_anderson"];
          const randomUser = fallbackUsers[Math.floor(Math.random() * fallbackUsers.length)];
          dbResults.innerHTML += `<p style="color:#FFFFFF;">${randomUser} | ${randomUser}@system.com | ${1000 + streamedCount}</p>`;
          streamedCount++;
        } else {
          clearInterval(streamInterval);
          document.getElementById("db-status").style.display = "none";
          dbResults.innerHTML += `<p style="color:#00FF00;">✓ Query completed. ${streamedCount} rows returned.</p>`;
        }
      }, 600);
    }, 5000);
    
    return false;
  },
  addText: function (key) {
    //Main function to add the code
    if (key.keyCode == 18) {
      // key 18 = alt key
      Typer.accessCount++; //increase counter
      if (Typer.accessCount >= 3) {
        // if it's presed 3 times
        Typer.makeAccess(); // make access popup
      }
    } else if (key.keyCode == 20) {
      // key 20 = caps lock
      Typer.deniedCount++; // increase counter
      if (Typer.deniedCount >= 3) {
        // if it's pressed 3 times
        Typer.makeDenied(); // make denied popup
      }
    } else if (key.keyCode == 27) {
      // key 27 = esc key
      Typer.hidepop(); // hide all popups
    } else if (key.keyCode == 49 && key.shiftKey) {
      // key 1 + shift = ! key (system breach)
      Typer.makeSystemBreach();
    } else if (key.keyCode == 50 && key.shiftKey) {
      // key 2 + shift = @ key (camera access)
      Typer.makeCameraAccess();
    } else if (key.keyCode == 51 && key.shiftKey) {
      // key 3 + shift = # key (GPS tracking)
      Typer.makeGpsTracking();
    } else if (key.keyCode == 52 && key.shiftKey) {
      // key 4 + shift = $ key (file system)
      Typer.makeFileSystem();
    } else if (key.keyCode == 53 && key.shiftKey) {
      // key 5 + shift = % key (database query)
      Typer.makeDatabaseQuery();
    } else if (key.ctrlKey == true && key.keyCode == "65") {
      // key 65 = A key
      window.open(
        "https://angel.co/l/2xHh3M",
        "Find Start Up Jobs Near You",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "66") {
      // key 66 = B key
      window.open(
        "https://belkin.evyy.net/ORAXJK",
        "Belkin: Tech Made Easy",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "67") {
      // key 67 = C key
      // 'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=53371&t202kw=dmr1-key',
      // 'Darkmoon Realm MMORPG',
      window.open(
        "https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=63431&t202kw=nmax1-key",
        "Buy Bitcoin Here",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "68") {
      // key 68 = D key
      window.open(
        "https://massdrop.7eer.net/b3dLem",
        "Drop.com: Keyboards & Headphones",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "69") {
      // key 69 = E key
      window.open(
        "http://visualsitesearch.com",
        "vss",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "70") {
      // key 70 = F key
      window.open(
        "http://find-dental-plans.com?t202id=53208",
        "find-dental-plans",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "71") {
      // key 71 = G key
      window.open(
        "https://robinhood.com/creditcard/?referral_code=e4748b98",
        //'https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=93499&t202kw=en-redir-key',
        "Enlisted",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (
      (key.ctrlKey == true || key.metaKey == true) &&
      key.keyCode == "72"
    ) {
      // key 72 = H key show help
      document.getElementById("settings").style.display = "block";
      document.querySelector(".subscribe-section").style.display = "none";
    } else if (key.ctrlKey == true && key.keyCode == "74") {
      // key 74 = J key
      window.open(
        "https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=13559&t202kw=ogx1-key",
        "Opera GX: THe Browser For Gamers",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "75") {
      // key 75 = K key
    } else if (key.ctrlKey == true && key.keyCode == "76") {
      // key 76 = L key
      window.open(
        "https://lovable.dev/invite/2796cac3-b3ca-4dc0-bcc8-5d1b0f07ff0b",
        "Lovable",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    /* } else if (key.ctrlKey == true && key.keyCode == "77") {
      // key 77 = M key
      window.open(
        "https://acquisition.com/leads?pv=64af6b4fe7889347b40de558",
        "$100M Leads",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      ); */
    } else if (
      (key.ctrlKey == true || key.metaKey == true) &&
      key.keyCode == "77"
    ) {
      // key 77 = M
      //show .subscribe-section element
      document.querySelector(".subscribe-section").style.display = "block";
    } else if (key.ctrlKey == true && key.keyCode == "78") {
      // key 78 = N
      /* window.open(
        'https://www.neonmob.com/?rc=uwe8y&rh=ht&rs=ht-key',
        'NeonMob: Collectible Digital Art',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      ); */
    } else if (key.ctrlKey == true && key.keyCode == "79") {
    } else if (key.ctrlKey == true && key.keyCode == "80") {
      // key 80 = p
      //https://202.redirexit.com/tracking202/redirect/dl.php?t202id=63417&t202kw=vtx1-ley vortex cloud gaming
      window.open(
        "https://202.redirexit.com/tracking202/redirect/dl.php?t202id=63448&t202kw=wowd1-key",
        "World Of Warships",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "81") {
      // key 81 = w
    } else if (key.ctrlKey == true && key.keyCode == "82") {
      // key 82 = R key
      window.open(
        "https://tech.ck.page",
        "Develop a Career in Tech!",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "83") {
      // key 83 = S key
      //https://act.webull.com/on/IKOCuq76DkaY/t0y/inviteUs/recommend_1343_A_push
      //https://hackertyper.com/sponsor/?utm_source=ht-key
      //Sponsor HackerTyper
      window.open(
        "https://stargateasi.com/?utm_source=ht-key",
        "Stargate ASI",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
      /* window.open(
        'https://deals.hackertyper.com/?utm_source=ht-fp',
        'HackerTyper Holiday Game Guide',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      ); */
    } else if (key.ctrlKey == true && key.keyCode == "82") {
      // key 82 = r key
      window.open(
        "http://amzn.to/S0g0Qg",
        "rby",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "83") {
      // key 83 = s key
      window.open(
        "https://stargateasi.com/?utm_source=ht-key",
        "Stargate ASI",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (key.ctrlKey == true && key.keyCode == "84") {
      // key 84 = t key
      window.open(
        "https://docutyper.com/?utm_source=ht-key",
        "DocuTyper",
        "height=800,width=1200,menubar=1,status=1,scrollbars=1"
      );
    } else if (Typer.text) {
      // otherway if text is loaded
      var cont = Typer.content(); // get the console content
      if (cont.substring(cont.length - 1, cont.length) == "|")
        // if the last char is the blinking cursor
        document.querySelector("#console").innerHTML = document
          .querySelector("#console")
          .innerHTML.substring(0, cont.length - 1); // remove it before adding the text
      if (key.keyCode != 8) {
        // if key is not backspace
        Typer.index += Typer.speed; // add to the index the speed
      } else {
        if (Typer.index > 0)
          // else if index is not less than 0
          Typer.index -= Typer.speed; //     remove speed for deleting text
      }
      // var text = $('<div/>').text(Typer.text.substring(0, Typer.index)).html(); // parse the text for stripping html enities
      var text = Typer.text.substring(0, Typer.index);
      var rtn = new RegExp("\n", "g"); // newline regex
      var rts = new RegExp("\\s", "g"); // whitespace regex
      var rtt = new RegExp("\\t", "g"); // tab regex

      document.querySelector("#console").innerHTML = text
        .replace(rtn, "<br/>")
        .replace(rtt, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(rts, "&nbsp;");
      // replace newline chars with br, tabs with 4 space and blanks with an html blank
      // Scroll to keep content visible above the footer
      let footerHeight = 40;
      if (window.innerWidth <= 480) {
        footerHeight = 60;
      } else if (window.innerWidth <= 768) {
        footerHeight = 50;
      }
      
      const windowHeight = window.innerHeight;
      const console = document.querySelector("#console");
      const consoleBottom = console.getBoundingClientRect().bottom;
      
      if (consoleBottom > (windowHeight - footerHeight - 20)) {
        window.scrollBy(0, 50);
      }
    }
    if (key.preventDefault && key.keyCode != 122) {
      // prevent F11(fullscreen) from being blocked
      key.preventDefault();
    }
    if (key.keyCode != 122) {
      // otherway prevent keys default behavior
      key.returnValue = false;
    }
  },

  updLstChr: function () {
    // blinking cursor
    var cont = this.content(); // get console
    if (cont.substring(cont.length - 1, cont.length) == "|")
      // if last char is the cursor
      document.querySelector("#console").innerHTML = document
        .querySelector("#console")
        .innerHTML.substring(0, cont.length - 1);
    else this.write("|"); // else write it
  },
};

Typer.init();

document.addEventListener("touchstart", (e) => {
  if (e.target.id !== "subscribe-btn") {
    document.getElementById("settings").style.display = "none";
    Typer.addText(e); //Capture the tap event for mobile and call the addText, this is executed on page load
  }
});

document.addEventListener("keydown", (e) => {
  document.getElementById("settings").style.display = "none";
  document.querySelector(".subscribe-section").style.display = "none";
  Typer.addText(e); //Capture the keydown event and call the addText, this is executed on page load
});

document.querySelector("#showhelp").addEventListener("click", (e) => {
  document.getElementById("settings").style.display = "block";
  var element = document.getElementById("subscribe-section");
  if (element) {
    element.style.display = "none";
  }
});

document.querySelector("#showmenu").addEventListener("click", (e) => {
  document.getElementById("settings").style.display = "none";
  var element = document.getElementById("subscribe-section");
  if (element) {
    element.style.display = "block";
  }
});

document.querySelector(".settings-btn").addEventListener("click", (e) => {
  document.getElementById("settings").style.display = "none";
});
