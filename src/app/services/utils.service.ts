//import { Injectable,Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IBreadcrumb } from 'ng2-breadcrumbs';
import { InsightService } from './insights/insight.service';
import { UserService } from './user.service';

/*@Pipe({
  name: 'filter'
 })*/
@Injectable()
//export class UtilsService  implements PipeTransform{
export class UtilsService {
  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  constructor(private datePipe: DatePipe,
    private _is: InsightService,
    private _us: UserService, ) { }
  isLoaded(loading: boolean): boolean {
    return loading === false;
  }
  transform(items: any[], term): any {
    return term
      ? items.filter(item => item.message.indexOf(term) !== -1)
      : items;
  }
  eventDates(start, end): string {
    // Display single-day events as "Jan 7, 2018"
    // Display multi-day events as "Aug 12, 2017 - Aug 13, 2017"
    const startDate = this.datePipe.transform(start, 'mediumDate');
    const endDate = this.datePipe.transform(end, 'mediumDate');
    if (startDate === endDate) {
      return startDate;
    } else {
      return `${startDate} - ${endDate}`;
    }
  }
  eventDatesTimes(start, end): string {
    // Display single-day events as "1/7/2018, 5:30 PM - 7:30 PM"
    // Display multi-day events as "8/12/2017, 8:00 PM - 8/13/2017, 10:00 AM"
    const _shortDate = 'M/d/yyyy';
    const startDate = this.datePipe.transform(start, _shortDate);
    const startTime = this.datePipe.transform(start, 'shortTime');
    const endDate = this.datePipe.transform(end, _shortDate);
    const endTime = this.datePipe.transform(end, 'shortTime');

    if (startDate === endDate) {
      return `${startDate}, ${startTime} - ${endTime}`;
    } else {
      return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
  }
  eventPast(eventEnd): boolean {
    // Check if event has already ended
    const now = new Date();
    const then = new Date(eventEnd.toString());
    return now >= then;
  }
  tabIs(currentTab: string, tab: string): boolean {
    // Check if current tab is tab name
    return currentTab === tab;
  }
  displayCount(guests: number): string {
    // Example usage:
    // {{displayCount(guests)}} attending this event
    const persons = guests === 1 ? ' person' : ' people';
    return guests + persons;
  }
  showPlusOnes(guests: number): string {
    // If bringing additional guest(s), show as "+n"
    if (guests) {
      return `+${guests}`;
    }
  }
  booleanToText(bool: boolean): string {
    // Change a boolean to 'Yes' or 'No' string
    return bool ? 'Yes' : 'No';
  }
  capitalize(str: string): string {
    // Capitalize first letter of string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  //Removeing html tags from string
  stripTags(value: any, args?: any): any {
    return value ? String(value).replace(/<[^>]+>/gm, '') : '';
  }
  toDateString(val) {
    return (new Date(val)).toDateString();
  }
  toTimeString(val) {
    return (new Date(val)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  toDateTimeString(val) {
    var date = new Date(val)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.toString().split(' ')[0]
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    //minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = day + '  ' + hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  toUserFriendlyDate(val) {
    let d = new Date(val);
    return (d.toString().split(' ')).slice(0, -5).join(' ');
  }
  inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  }
  isKeyExistsForVal(needleVal, haystack) {
    let t = -1;
    Object.keys(haystack).forEach(key => {

      if (haystack[key].id === needleVal) {
        t = parseInt(key);
      }
    });
    return t;
  }
  getHelpStatuses() {
    return ['Pending', 'In Progress', 'Resolved'];
  }
  getFewWords(para, len = 15) {
    let seg = para.split(' ');
    return (seg.length > len) ? seg.slice(0, len).join(' ') + '...' : seg.slice(0, len).join(' ');
  }
  objLen(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }
  updateUserSession(obj) {
    let temp = JSON.parse(localStorage.currentUser);
    Object.keys(obj).forEach(val => {
      temp.user[val] = obj[val];
    });
    localStorage.currentUser = JSON.stringify(temp);
  }
  slugify(input: string): string {
    return input.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
  list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      Object.assign(list[i], { 'children': [] }); // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent !== null) {
        list[map[node.parent]]['children'].push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
  extractImgs(rawString) {
    var regex = /<img.*?src="(.*?)"/gi, result,
      urls = [];
    while ((result = regex.exec(rawString))) {
      urls.push(result[1]);
    }
    return urls;
  }
  private breacrumbSource = new BehaviorSubject<IBreadcrumb[]>([]);
  currentBSource = this.breacrumbSource.asObservable();

  changeBreadCrumb(bcList: IBreadcrumb[]) {
    this.breacrumbSource.next(bcList);
  }
  extIcon(ext, orgName = null) {
    if (orgName.length) {
      ext = orgName.split(".").pop() || '';
    }
    let allIcons = {
      pdf: 'file-pdf-o',
      csv: 'file-csv-o',
      jpg: 'file-image-o',
      doc: 'file-word-o',
      txt: 'file-text-o',
      docx: 'file-word-o',
      png: 'file-image-o',
      jpeg: 'file-image-o'
    };
    return allIcons[ext] || 'file-text-o';
  }
  detectmob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  showMatchedInsights(keyword, cb) {
    this._is.elasticInsights(keyword).subscribe(data => {
      if (data.success)
        (data.data !== undefined && data.data.insights.length) ? cb(data.data.insights) : cb([]);
    });
  }
  showMatchedTickers(keyword, cb) {
    this._is.elasticTickers(keyword).subscribe(data => {
      if (data.success)
        (data.data !== undefined && data.data.tickers.length) ? cb(data.data.tickers) : cb([]);
    });
  }
  // showMatchedAnalysts(keyword, cb) {
  //   this._us.elasticAnalysts(keyword).subscribe(data => {
  //     if (data.success) {
  //       (data.data !== undefined && data.data.users.length) ? cb(data.data.users) : cb([]);
  //     }
  //   });
  // }
  hint() {
    let results;
    let _this = this;
    return results = [
      {
        match: /\B#(\w*)$/,
        search: function (keyword, callback) {
          _this.showMatchedInsights(keyword, ((items) => {
            callback(items);
          }));
        },
        template: function (item) {
          return item.headline;
        },
        content: function (item) {
          return $('<a href="insights/compose/preview/' + item.id + '" class="mentionned">' + item.headline + '</a>')[0];
        }
      },
      {
        match: /\B@(\w*)$/,
        // search: function (keyword, callback) {
        //   _this.showMatchedAnalysts(keyword, ((items) => {
        //     callback(items);
        //   }));
        // },
        template: function (item) {
          return item.first_name + ' ' + item.last_name;
        },
        content: function (item) {
          return $('<a href="insights/compose/preview/' + item.id + '" class="mentionned">' + item.first_name + ' ' + item.last_name + '</a>')[0];
        }
      },
      {
        match: /\B\$(\w*)$/,
        search: function (keyword, callback) {
          _this.showMatchedTickers(keyword, ((items) => {
            callback(items);
          }));
        },
        template: function (item) {
          return item.name;
        },
        content: function (item) {
          return $('<a href="insights/compose/preview/' + item.id + '" class="mentionned">' + item.name + '</a>')[0];
        }
      }
    ]
  }
  isPastedEvent($ele, cb) {
    let ctrlDown = false,
      ctrlKey = 17,
      cmdKey = 91,
      vKey = 86,
      cKey = 67;

    $($ele).keydown(function (e) {
      $(document).keydown(function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
      }).keyup(function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
      });
      if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) {
        cb(false);
      }
      else {
        cb(true);
      }
    });
  }
}


