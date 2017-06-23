import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params,  } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'top-nav',
    templateUrl: 'topnav.html',
})

export class TopNavComponent {

  private subscription;
  private actionType:string = 'all';
  public actionTypeIndicator:string = '';
  public actionBackgroundColor:string = '#007402';
  public roleId:string;

	constructor(
		private router: Router,
    private route: ActivatedRoute
	){
    this.subscription = router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        let action:string = val.url;
        let actions:Array<string> = action.split('/');
        this.actionType = actions[3];

        if(actions[2] === 'message-center'){
          this.actionType = actions[2];
        }else if(actions[2] === 'expired-medicines' || actions[2] === 'expired-medicine-view'){
          this.actionType = 'expired-meds';
        }
        this.changeFilterType();
      }
    });
  }

  public username:string = '';

  private changeFilterType():void{
    if(this.actionType === 'expired-meds'){
      this.actionTypeIndicator = 'EXPIRED MEDICINES';
      this.actionBackgroundColor = '#0e628e';
    }else if(this.actionType === 'counterfeit'){
      this.actionTypeIndicator = 'COUNTERFEIT';
      this.actionBackgroundColor = '#052535';
    }else if(this.actionType === 'disaster-recovery'){
      this.actionTypeIndicator = 'DISASTER RECOVERY';
      this.actionBackgroundColor = '#2eb64e';
    }else if(this.actionType === 'licensing'){
      this.actionTypeIndicator = 'LICENSING';
      this.actionBackgroundColor = '#ea4444';
    }else if(this.actionType === 'message-center'){
      this.actionTypeIndicator = 'MESSAGE CENTER';
      this.actionBackgroundColor = '#EB9316';
    }else{
      this.actionTypeIndicator = '';
      this.actionBackgroundColor = '#007402';
    }
  }

	changeTheme(color: string): void {
		var link: any = $('<link>');
		link
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', 'themes/app-'+color+'.css');
	}

	rtl(): void {
		var body: any = $('body');
		body.toggleClass('rtl');
	}

	sidebarToggler(): void  {
		var sidebar: any = $('#sidebar');
		var mainContainer: any = $('.main-container');
		sidebar.toggleClass('sidebar-left-zero');
		mainContainer.toggleClass('main-container-ml-zero');
	}

	public logout():void {
		localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    localStorage.removeItem('roleId');
		localStorage.removeItem('sessionToken');
		this.router.navigate(['/']);
	};

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.roleId = localStorage.getItem('roleId');
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
