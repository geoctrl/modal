// require app styles
import './ts-modal/ts-modal.scss';

// require vendor dependencies
import angular from 'angular';
import 'velocity-animate';

var app = angular.module('app', []);

// modal
import tsModal from './ts-modal';
tsModal(app);

import dev from './dev';
dev(app);
