#!/bin/zsh
# -------------------------------
# Dock setup script using bundle IDs
# Pure native macOS (Ventura+)
# -------------------------------

# ----- CONFIG -----
# Base Dock apps shared by all teams
DOCK_START=(
  "System Preferences"
  "Google Chrome"
  "Safari"
  "Adobe After Effects"
  "Adobe Premiere Pro"
  "Adobe Media Encoder"
  "Adobe Photoshop"
)

DOCK_END=(
  "Microsoft Word"
  "Microsoft Excel"
  "Microsoft Outlook"
  "VLC"
  "Cyberduck"
  "Zoom"
  "Slack"
  "Creative Cloud"
  "Self Service"
)

# ----- TEAM-SPECIFIC APPS -----
VALID_TEAMS=(
  "video"
  "design"
  "audio"
  "photo"
  "ingest"
)

DOCK_video=(
  "${DOCK_START[@]}"
  "PCoIPClient"
  "${DOCK_END[@]}"
)

DOCK_design=(
  "${DOCK_START[@]}"
  "${DOCK_END[@]}"
)

DOCK_audio=(
  "${DOCK_START[@]}"
  "Audio Hijack"
  "Pro Tools"
  "Descript"
  "${DOCK_END[@]}"
)

DOCK_photo=(
  "${DOCK_START[@]}"
  "Photo Mechanic 6"
  "${DOCK_END[@]}"
)

DOCK_ingest=(
  "System Preferences"
  "Calendar"
  "Google Chrome"
  "Safari"
  "Iconik Desktop Agent"
  "Hedge Mac"
  "Aspera Connect"
  "LucidLink"
  "Self Service"
)

LOG_FILE="${TMPDIR:-/tmp}/dock_setup_$(date +%Y%m%d_%H%M%S).log"
ERROR_COUNT=0
SCRIPT_DIR=${0:A:h}
SCRIPT_NAME=${0:t}
TEST_MODE=false
SHOW_XML=false
INTERACTIVE=false
VERBOSE=false
TEAM=""
ADOBE_YEAR=""

# ----- FUNCTIONS -----
usage() {
  local valid_teams_str="${(j:, :)VALID_TEAMS}"
  cat <<EOF
Usage: $SCRIPT_NAME <team> [options]

Required:
  team                    The team name for which to set up the Dock.
                          Valid Teams: $valid_teams_str

Options:
  -t, --test              Run in test mode (no changes are applied).
  -x, --xml               In test mode, also show the generated XML.
  -a, --adobe <year>      Specify the year for Adobe apps, if you
                          don't want to use the latest installed
                          version for each app. Example: -a 2025
  -i, --interactive       Prompt before continuing if any apps are missing.
  --rollback              Restore the Dock from the most recent backup.
  -h, --help              Show this help message.

Flags and options can appear before or after the team name.

Examples:
Examples (copy and paste these into your terminal):

  # Basic usage for the audio team
  $SCRIPT_DIR/$SCRIPT_NAME audio

  # Set up the Dock for the video team, using Adobe 2025
  $SCRIPT_DIR/$SCRIPT_NAME video -a 2025

  # Test mode for the design team (no changes applied)
  $SCRIPT_DIR/$SCRIPT_NAME -t design

  # Test mode for the photo team, show generated XML
  $SCRIPT_DIR/$SCRIPT_NAME photo --test --xml

  # All options in any order are valid:
  $SCRIPT_DIR/$SCRIPT_NAME -a 2024 -x -t video
  $SCRIPT_DIR/$SCRIPT_NAME ingest -t -x -a 2024

  # Options without assosciated values can be combined:
  $SCRIPT_DIR/$SCRIPT_NAME -xt ingest
  $SCRIPT_DIR/$SCRIPT_NAME audio -tx -a 2024

  # Interactive mode - prompt if apps are missing
  $SCRIPT_DIR/$SCRIPT_NAME video -i

  # Test with interactive check
  $SCRIPT_DIR/$SCRIPT_NAME -t -i design

  # Rollback to previous Dock setup, if available
  $SCRIPT_DIR/$SCRIPT_NAME --rollback

  # Show this help message
  $SCRIPT_DIR/$SCRIPT_NAME --help
EOF
}

log_to_file() {
  local level="$1"
  local message="$2"
  printf "[%s] %s: %b" "$(date +%H:%M:%S)" "$1" "$2" >> "$LOG_FILE"
}

log() {
  local level="$1"
  shift
  local message="$*"

  if [[ "$level" == "ERROR" || "$level" == "WARN" ]]; then
    ((ERROR_COUNT++))
  fi

  if [[ "$level" == "PRINT" ]]; then
    log_to_file "INFO" "$message"
    printf "%b" "$message"
    return
  fi

  if [[ "$VERBOSE" == true ]]; then
    printf "[%s] %s: %b" "$(date +%H:%M:%S)" "$level" "$message" >&2
  fi
  log_to_file "$level" "$message"
}

validate_environment() {
  local missing=()

  # Check required commands
  for cmd in defaults mdfind osascript killall; do
    if ! command -v "$cmd" &>/dev/null; then
      missing+=("$cmd")
    fi
  done

  # Check macOS version
  local os_version=$(sw_vers -productVersion)
  if [[ "${os_version%%.*}" -lt 13 ]]; then
    log "ERROR" "Requires macOS 13 (Ventura) or later. Found: $os_version\n"
    exit 1
  fi

  if [[ ${#missing[@]} -gt 0 ]]; then
    log "ERROR" "Missing required commands: ${missing[*]}\n"
    exit 1
  fi
}

backup_dock() {
  local backup_dir="$HOME/.dock_backups"
  local backup_file="$backup_dir/dock_$(date +%Y%m%d_%H%M%S).plist"
  
  mkdir -p "$backup_dir"
  defaults export com.apple.dock "$backup_file" 2>/dev/null
  
  if [[ -f "$backup_file" ]]; then
    log "INFO" "Backup saved: $backup_file\n"
    # Keep only last 10 backups
    ls -t "$backup_dir"/dock_*.plist | tail -n +11 | xargs rm 2>/dev/null || true
    echo "$backup_file"
  fi
}

restore_dock() {
  local backup_file="$1"
  if [[ -f "$backup_file" ]]; then
    defaults import com.apple.dock "$backup_file"
    killall Dock
    log "INFO" "Dock restored from: $backup_file\n"
  fi
}

interactive_mode() {
  local missing_apps=()
  local bundleID

  # Check each app in the dock order
  for app in "${DOCK_ORDER[@]}"; do
    bundleID="$(get_bundle_id "$app")"
    if [[ -z "$bundleID" ]]; then
      missing_apps+=("$app")
    fi
  done

  # If apps are missing, prompt the user
  if [[ ${#missing_apps[@]} -gt 0 ]]; then
    printf "\n⚠️  The following apps are not installed:\n"
    printf "  - %s\n" "${missing_apps[@]}"
    printf "\nContinue without these apps? [y/N] "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
      log "INFO" "Setup cancelled by user\n"
      exit 0
    fi
    log "INFO" "Continuing without ${#missing_apps[@]} missing app(s)\n"
  fi
}

get_bundle_id() {
  local appName="$1"
  osascript -e "id of app \"$appName\"" 2>/dev/null
}

find_app_path() {
  local bundleID="$1"
  local foundPath=$(mdfind -onlyin "$HOME/Applications" -onlyin /Applications -onlyin /System/Applications "kMDItemCFBundleIdentifier == '$bundleID'" \
    | sort -r \
    | head -n 1)

  if [[ -n "$foundPath" ]]; then
    # Use realpath if available, otherwise fall back to readlink loop
    if command -v realpath &>/dev/null; then
      realpath "$foundPath"
    else
      local targetFile="$foundPath"
      while [[ -L "$targetFile" ]]; do
        targetFile=$(readlink "$targetFile")
      done
      echo "$targetFile"
    fi
  fi
}

get_adobe_version() {
  local appName="$1"
  local foundApp
  local app_folders=()

  # Only add folders that exist
  for folder in /Applications "$HOME/Applications" /System/Applications; do
    [[ -d "$folder" ]] && app_folders+=("$folder")
  done

  # If no valid folders, return empty
  if [[ ${#app_folders[@]} -eq 0 ]]; then
    echo ""
    return
  fi

  if [[ -n $ADOBE_YEAR ]]; then
    foundApp=$(find "${app_folders[@]}" -maxdepth 4 -name "$appName $ADOBE_YEAR.app" \
      | xargs -I{} basename "{}" .app)
  fi

  if [[ -z $foundApp ]]; then
    foundApp=$(find "${app_folders[@]}" -maxdepth 4 -type d -name "$appName [0-9][0-9][0-9][0-9].app" \
    | xargs -I{} basename "{}" .app \
    | sort -Vr \
    | head -n1)
  fi

  if [[ -n "$foundApp" ]]; then
    echo "$foundApp"
  else
    echo ""
  fi
}

process_adobe_apps() {
  local temp_arr=()
  local app
  for app in "$@"; do
    if [[ "$app" == Adobe* ]]; then app=$(get_adobe_version "$app"); fi
    if [[ -n "$app" ]]; then temp_arr+=("$app"); fi
  done
  DOCK_ORDER=("${temp_arr[@]}")
}

get_team_dock() {
  local TEAM_DOCK="DOCK_$TEAM"
  DOCK_ORDER=("${(@P)TEAM_DOCK}")
  process_adobe_apps "${DOCK_ORDER[@]}"
}

get_app_info() {
  local app="$1"
  local ppName
  local bundleID="$(get_bundle_id "$app")"
  local appPath="$(find_app_path "$bundleID")"

  if [[ -z "$bundleID" ]]; then
    log "WARN" "Skipping (no bundle ID): $app\n"
    return 1
  fi

  if [[ -z "$appPath" ]]; then
    log "WARN" "App location not found: $app\n"
    return 1
  fi

  if [[ -n "$appPath" ]]; then
    appName=$(basename "$appPath" .app)
  fi

  echo "$bundleID|$appPath|$appName"
}

build_xml() {
  local app bundleID appPath appName
  local xml="<array>"
  for app in "$@"; do
    bundleID="$(get_bundle_id "$app")"
    appPath="$(find_app_path "$bundleID")"

    # Skip if no bundle ID or path (silently in build_xml)
    if [[ -z "$bundleID" ]] || [[ -z "$appPath" ]]; then
      continue
    fi

    if [[ -n "$appPath" ]]; then
      appName=$(basename "$appPath" .app)
    fi

    if [[ -n "$appName" ]]; then
      # Append the XML for one app tile to the string.
      xml+=$(<<EOF
<dict>
<key>tile-data</key>
<dict>
<key>bundle-identifier</key>
<string>$bundleID</string>
<key>file-data</key>
<dict>
  <key>_CFURLString</key>
  <string>$appPath</string>
  <key>_CFURLStringType</key>
  <integer>0</integer>
</dict>
<key>file-label</key>
<string>$appName</string>
<key>file-type</key>
<integer>1</integer>
</dict>
<key>tile-type</key>
<string>file-tile</string>
</dict>
EOF
)
    fi
  done
  xml+="</array>"
  echo "$xml"
}

apply_or_print() {
  local app xml info
  xml=$(build_xml "${DOCK_ORDER[@]}")
  if [[ "$TEST_MODE" == true ]]; then
    log "PRINT" "----- TEST MODE -----\n"
    log "PRINT" "Dock order for $TEAM team:\n\n"
    for app in "${DOCK_ORDER[@]}"; do
      info=$(get_app_info "$app")
      IFS='|' read -r bundleID appPath appName <<< "$info"
      if [[ -n "$appName" ]]; then
        log "PRINT" "- $appName ($bundleID)\n"
      else
        log "PRINT" "- $app: Not installed\n"
      fi
    done

    if [[ "$SHOW_XML" == true ]]; then
      log "\nPRINT" "Generated XML:\n"
      log "PRINT" "$xml\n"
    fi
  else
    BACKUP_FILE=$(backup_dock)
    if [[ -z "$BACKUP_FILE" ]]; then
      log "WARN" "Failed to create backup, but continuing...\n\n"
    fi
    log "PRINT" "Setting new Dock...\n"
    # Overwrite the persistent-apps array in one command
    defaults write com.apple.dock persistent-apps "$xml"
    killall Dock
    log "PRINT" "Dock updated for $TEAM team.\n"
  fi
}

handle_flag() {
  case "$1" in
    a) ADOBE_YEAR="$2" ;;
    t) TEST_MODE=true ;;
    x) SHOW_XML=true ;;
    i) INTERACTIVE=true ;;
    v) VERBOSE=true ;;
    h) usage; exit 0 ;;
    *)
      log "ERROR" "Unknown option: -$1\n"
      usage
      exit 1
      ;;
  esac
}

# ----- MAIN SCRIPT -----
# Smart argument parsing
# This loop processes flags and identifies the single positional 'team' argument.
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -[a-zA-Z][a-zA-Z]*)
      flags="${1#-}"
      shift
      for (( i=1; i<=${#flags}; i++ )); do
        flag_char="${flags:$((i-1)):1}"
        # Handle flags that need arguments
        if [[ "$flag_char" == "a" ]]; then
          log "PRINT" "ERROR: Flag -a requires an argument and cannot be combined with other flags.\n"
          log "PRINT" "Use: -a 2025 -tv  or  --adobe 2025 -tv  instead of -atv 2025\n\n"
          usage
          exit 1
        else
          handle_flag "$flag_char"
        fi
      done
      ;;
    -t|--test) handle_flag "t"; shift ;;
    -x|--xml) handle_flag "x"; shift ;;
    -a|--adobe) handle_flag "a" "$2"; shift 2 ;;
    -i|--interactive) handle_flag "i"; shift ;;
    -v|--verbose) handle_flag "v"; shift ;;
    -h|--help) handle_flag "h" ;;
    --rollback)
      log "INFO" "Restoring previous Dock from backup...\n"
      LAST_BACKUP=$(ls -t "$HOME/.dock_backups"/dock_*.plist 2>/dev/null | head -n1)
      if [[ -n "$LAST_BACKUP" ]]; then
        restore_dock "$LAST_BACKUP"
        exit 0
      else
        log "ERROR" "No backup found to restore.\n"
        exit 1
      fi
      ;;
    *)
      break
      ;;
  esac
done

if [[ "$#" -ne 1 ]]; then
  log "ERROR" "You must specify exactly one team name.\n"
  usage
  exit 1
fi
TEAM="$1"

if [[ "$SHOW_XML" == true && "$TEST_MODE" == false ]]; then
  SHOW_XML=false
  log "WARN" "--xml flag ignored when not in test mode.\n"
fi

# Validate team argument
if [[ -z "$TEAM" ]] || ! [[ " ${VALID_TEAMS[*]} " == *" $TEAM "* ]]; then
  log "ERROR" "Invalid or missing team name.\n"
  usage
  exit 1
fi

# ----- EXECUTION -----
validate_environment
get_team_dock

if [[ "$INTERACTIVE" == true ]]; then
  interactive_mode
fi
DOCK_XML=$(build_xml "${DOCK_ORDER[@]}")
apply_or_print

if [[ $ERROR_COUNT -gt 0 ]]; then
  log "WARN" "Completed with $ERROR_COUNT warnings. See: $LOG_FILE\n"
fi