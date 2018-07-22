const getRoundIcon = function(name) {
  switch (name) {
    case 'ARDR':
      return 'cc ' + 'ARDR-alt'
    case 'CLAM':
      return 'cc ' + 'CLAM-alt'
    case 'DCR':
      return 'cc ' + 'DCR-alt'
    case 'DGB':
      return 'cc ' + 'DGB-alt'
    case 'ETC':
      return 'cc ' + 'ETC-alt'
    case 'ETH':
      return 'cc ' + 'ETH-alt'
    case 'FCT':
      return 'cc ' + 'FCT-alt'
    case 'GAME':
      return 'cc ' + 'GAME-alt'
    case 'GNT':
      return 'cc ' + 'GNT-alt'
    case 'LBC':
      return 'cc ' + 'LBC-alt'
    case 'NEOS':
      return 'cc ' + 'NEOS-alt'
    case 'OMG':
      return 'cc ' + 'OMG-alt'
    case 'OMNI':
      return 'cc ' + 'OMNI-alt'
    case 'PINK':
      return 'cc ' + 'PINK-alt'
    case 'PPC':
      return 'cc ' + 'PPC-alt'
    case 'RADS':
      return 'cc ' + 'RADS-alt'
    case 'REP':
      return 'cc ' + 'REP-alt'
    case 'STEEM':
      return 'cc ' + 'STEEM-alt'
    case 'STRAT':
      return 'cc ' + 'STRAT-alt'
    case 'SYS':
      return 'cc ' + 'SYS-alt'
    case 'USDT':
      return 'cc ' + 'USDT-alt'
    case 'ZEC':
      return 'cc ' + 'ZEC-alt'
    case 'GNO':
      return 'cc ' + 'GNO-alt'
    case 'BCH':
      return 'cc ' + 'BCC-alt'
    case 'BLK':
      return 'cc ' + 'BC'
    case 'SBD':
      return 'cc ' + 'STEEM-alt'

    default:
      return 'cc ' + name
  }
}

const getIcon = function(name) {
  switch (name) {
    case 'GNO':
      return 'cc ' + 'GNO'
    case 'BCH':
      return 'cc ' + 'BCC'
    case 'AMP':
      return 'cc ' + 'AMP-alt'
    case 'BCN':
      return 'cc ' + 'BCN-alt'
    case 'BLK':
      return 'cc ' + 'BC-alt'
    case 'SBD':
      return 'cc ' + 'STEEM'
    case 'STR':
      return 'cc ' + 'STR-alt'
    case 'XCP':
      return 'cc ' + 'XCP-alt'
    case 'XEM':
      return 'cc ' + 'XEM-alt'
    case 'XPM':
      return 'cc ' + 'XPM-alt'
    case 'XRP':
      return 'cc ' + 'XRP-alt'
    case 'VTC':
      return 'cc ' + 'VTC-alt'
    case 'VRC':
      return 'cc ' + 'VRC-alt'
    case 'POT':
      return 'cc ' + 'POT-alt'
    case 'NXT':
      return 'cc ' + 'NXT-alt'
    case 'NMC':
      return 'cc ' + 'NMC-alt'
    case 'LTC':
      return 'cc ' + 'LTC-alt'
    case 'GRC':
      return 'cc ' + 'GRC-alt'
    case 'BTS':
      return 'cc ' + 'BTS-alt'
    case 'BTC':
      return 'cc ' + 'BTC-alt'
    case 'BTCD':
      return 'cc ' + 'BTCD-alt'
    case 'NOTE':
      return 'cc ' + 'NOTE-alt'
    case 'MAID':
      return 'cc ' + 'MAID-alt'
    case 'DOGE':
      return 'cc ' + 'DOGE-alt'
    case 'DASH':
      return 'cc ' + 'DASH-alt'

    default:
      return 'cc ' + name
  }
}

export { getIcon, getRoundIcon }
