import React from "react";
import { AlbumListGrid } from "./AlbumListGrid";


export class AlbumListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance = this.props.AppInstance
    return (
         <AlbumListGrid AppInstance={AppInstance} data={this.props.data}/>   
    );
  }
}
